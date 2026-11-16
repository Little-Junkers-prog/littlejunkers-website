// Cutover guard. Everything is noindex until SITE_INDEXABLE=true is set on the
// production environment at the approved DNS cutover, so a preview or an early
// vercel.app deployment can never compete with the live Odoo site in search.
export const indexable = process.env.SITE_INDEXABLE === "true";
