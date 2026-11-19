-- Comparison Intelligence data contract, applied 2026-11-19.
-- Canonical provider registry, comparison events and inquiry master are reused.
-- This SQL is an auditable replay script, NOT an automatic client migration.
-- All functions use SECURITY INVOKER, with execution only for service_role.
CREATE OR REPLACE FUNCTION public.record_comparison_provider_action(
 p_provider_id uuid,p_size_yards integer,p_duration_days integer,p_action text
) RETURNS bigint LANGUAGE plpgsql SECURITY INVOKER
SET search_path=public,pg_temp AS $function$
DECLARE v_session uuid;v_event bigint;v_event_name text;
BEGIN
 IF p_action NOT IN('detail','outbound') OR p_size_yards NOT IN(11,16,21)
    OR p_duration_days<3 OR p_duration_days>30
 THEN RAISE EXCEPTION 'Invalid comparison click action' USING ERRCODE='22023';END IF;
 IF NOT EXISTS(SELECT 1 FROM public.comparison_providers
    WHERE id=p_provider_id AND is_active=true AND visibility_status='public')
 THEN RAISE EXCEPTION 'Unknown public comparison provider' USING ERRCODE='22023';END IF;
 v_event_name:=CASE p_action WHEN 'detail' THEN 'comparison_provider_detail_viewed'
                                  ELSE 'comparison_provider_outbound_clicked' END;
 INSERT INTO public.comparison_sessions(selected_size_yards) VALUES(p_size_yards)
 RETURNING id INTO v_session;
 INSERT INTO public.comparison_events(session_id,event_name,provider_id,event_context)
 VALUES(v_session,v_event_name,p_provider_id,
   jsonb_build_object('size_yards',p_size_yards,'duration_days',p_duration_days,
   'measurement','anonymous_comparison_click','source','website_v2_compare'))
 RETURNING id INTO v_event;
 RETURN v_event;
END;
$function$;
REVOKE ALL ON FUNCTION public.record_comparison_provider_action(uuid,integer,integer,text) FROM PUBLIC,anon,authenticated;
GRANT EXECUTE ON FUNCTION public.record_comparison_provider_action(uuid,integer,integer,text) TO service_role;

CREATE TABLE IF NOT EXISTS public.comparison_inquiry_details(
 inquiry_id uuid PRIMARY KEY REFERENCES public.customer_inquiries(id) ON DELETE CASCADE,
 provider_id uuid NOT NULL REFERENCES public.comparison_providers(id),
 selected_size_yards integer NOT NULL CHECK(selected_size_yards IN(11,16,21)),
 rental_days integer NOT NULL CHECK(rental_days BETWEEN 3 AND 30),
 interest_reason text NOT NULL DEFAULT ''
  CHECK(interest_reason IN('','price','weight','duration','size','availability','unsure')),
 created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.comparison_inquiry_details ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.comparison_inquiry_details FROM PUBLIC,anon,authenticated;
GRANT SELECT,INSERT ON public.comparison_inquiry_details TO service_role;
COMMENT ON TABLE public.comparison_inquiry_details IS
 'Typed comparison context for canonical customer_inquiries; does not duplicate customer identity.';

CREATE OR REPLACE FUNCTION public.create_comparison_inquiry(
 p_payload jsonb,p_provider_id uuid,p_size_yards integer,p_duration_days integer,p_interest_reason text
) RETURNS jsonb LANGUAGE plpgsql SECURITY INVOKER
SET search_path=public,pg_temp AS $function$
DECLARE v_result jsonb;v_inquiry uuid;
BEGIN
 IF p_payload->>'inquiry_type'<>'contact'
   OR p_payload->>'source_page'<>'Website V2 Comparison Exit'
   OR p_size_yards NOT IN(11,16,21) OR p_duration_days<3 OR p_duration_days>30
   OR coalesce(p_interest_reason,'') NOT IN('','price','weight','duration','size','availability','unsure')
 THEN RAISE EXCEPTION 'Invalid comparison inquiry' USING ERRCODE='22023';END IF;
 IF NOT EXISTS(SELECT 1 FROM public.comparison_providers
   WHERE id=p_provider_id AND is_active=true AND visibility_status='public')
 THEN RAISE EXCEPTION 'Unknown public comparison provider' USING ERRCODE='22023';END IF;
 v_result:=public.create_public_inquiry(p_payload);
 v_inquiry:=(v_result->>'inquiry_id')::uuid;
 IF v_inquiry IS NULL THEN RAISE EXCEPTION 'Canonical inquiry did not return ID';END IF;
 INSERT INTO public.comparison_inquiry_details(inquiry_id,provider_id,selected_size_yards,rental_days,interest_reason)
 VALUES(v_inquiry,p_provider_id,p_size_yards,p_duration_days,coalesce(p_interest_reason,''));
 RETURN v_result;
END;
$function$;
REVOKE ALL ON FUNCTION public.create_comparison_inquiry(jsonb,uuid,integer,integer,text) FROM PUBLIC,anon,authenticated;
GRANT EXECUTE ON FUNCTION public.create_comparison_inquiry(jsonb,uuid,integer,integer,text) TO service_role;

-- Recreate only the aggregate report; underlying raw click events remain intact.
DROP VIEW IF EXISTS public.comparison_competitor_click_daily;
CREATE VIEW public.comparison_competitor_click_daily
WITH (security_invoker=true) AS
SELECT (e.created_at AT TIME ZONE 'America/New_York')::date click_date,
 p.id provider_id,p.name provider_name,
 (e.event_context->>'size_yards')::integer size_yards,
 (e.event_context->>'duration_days')::integer duration_days,
 count(*) FILTER (WHERE e.event_name='comparison_provider_detail_viewed')::bigint interest_clicks,
 count(*) FILTER (WHERE e.event_name='comparison_provider_outbound_clicked')::bigint outbound_clicks
FROM public.comparison_events e
JOIN public.comparison_providers p ON p.id=e.provider_id
WHERE e.event_name IN('comparison_provider_detail_viewed','comparison_provider_outbound_clicked')
 AND e.event_context->>'measurement'='anonymous_comparison_click'
GROUP BY 1,2,3,4,5;
REVOKE ALL ON public.comparison_competitor_click_daily FROM PUBLIC,anon,authenticated;
GRANT SELECT ON public.comparison_competitor_click_daily TO service_role;

CREATE OR REPLACE VIEW public.comparison_callback_followups
WITH (security_invoker=true) AS
SELECT i.id inquiry_id,i.submitted_at,i.status,i.name_snapshot,i.phone_normalized,i.zip_code,
 i.contact_id,d.provider_id,p.name compared_provider,
 d.selected_size_yards,d.rental_days,d.interest_reason
FROM public.comparison_inquiry_details d
JOIN public.customer_inquiries i ON i.id=d.inquiry_id
JOIN public.comparison_providers p ON p.id=d.provider_id;
REVOKE ALL ON public.comparison_callback_followups FROM PUBLIC,anon,authenticated;
GRANT SELECT ON public.comparison_callback_followups TO service_role;
