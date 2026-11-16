// Manually curated Google reviews (charter §9). EMPTY ON PURPOSE.
//
// A review is only added here with its exact wording, the reviewer's public
// display name and Marcus's approval. The live Odoo homepage currently shows
// three (Mark A., John H., Dianna J.), but their exact text could not be
// captured verbatim for this draft, so none are published yet. While this list
// is empty the site links to the Google profile instead of showing quotes.

export type Review = { name: string; area?: string; text: string; source: "Google" };

export const reviews: Review[] = [];
