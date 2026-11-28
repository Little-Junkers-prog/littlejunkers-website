# Checkout V1 interactive review

This is a **design-only prototype**, not a public Next.js route, not a replacement for the existing booking app, and not a real booking or Stripe test. It lives under docs/design and does not connect to production or any external service. Sample prices ($325/$375/$425), weights (1/1.5/2 tons), exact example ZIPs and December 2026 calendar days are local design fixtures; they do not represent verified current rates or inventory. Only the confirmed-for-demo three-day / Zone A path can advance. The candidate spec lists what must be validated for real booking. The 11/16/21 dimensions and first-party imagery reference existing repository product assets.

To review locally, download/clone the review branch and run from the repository root:

```sh
python3 -m http.server 8000
```

Open http://localhost:8000/docs/design/checkout-v1/ in a browser. Do not host on a public site. A GitHub source viewer does not execute the prototype.

Suggested review journey:
1. Enter 30269, choose Quick or Help me choose, select a size and view the early price.
2. Change to another size and observe the price; test an unknown city/ZIP (cannot proceed).
3. Choose 3 days and Dec 7; test an unavailable date and a 4–30-day pending rate or 31+ custom quote.
4. Use Fill sample details, switch to Contractor to see conditional billing details, edit jobsite ZIP and revalidate schedule.
5. Review, edit, acknowledge simulation, simulate payment and see confirmation. No card input, API call, reservation, payment, message, or analytics.
6. Review desktop and mobile widths, keyboard navigation and sticky summary; do not enter real personal details. Reload to reset.

Run `node scripts/check-checkout-v1.mjs` for fixture, syntax and isolation checks. This is not a browser, accessibility, Stripe, Fleet, or operational integration test. Those remain release gates.
