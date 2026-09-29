# Project Parking Lot

Sprint 1 is complete. The following items are intentionally parked for future sprints so we can keep technical debt and pending work visible across chat sessions.

## Parked Items

- **Media Integration:** Upload final photography to the Supabase marketing-media bucket and replace all placeholder images.
- **Global Company Data:** Create a Supabase table for global company information (EIN, phone, service addresses) to dynamically feed the footer and contact sections.
- **Chatbot Integration:** Replace the dummy chatbot script in `app/layout.tsx` with the live provider script.
- **Legal Pages:** Build out the `/privacy-policy` and `/terms-of-service` routes with compliant copy.
- **Google Merchant Center Cleanup:** Review the existing Merchant Center account/feed, determine what Odoo or other source is publishing rental products, document the active errors, and remove/disable inappropriate product feeds if confirmed. Dumpster rentals and bulk-pickup services are not being treated as a V2 launch dependency. Revisit after the website migration unless an active Google Ads dependency is discovered.
