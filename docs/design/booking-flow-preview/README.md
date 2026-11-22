# Booking flow preview: source files

These are the source files of the clickable preview at
https://claude.ai/artifact/Qf1YZuYMYtZvsdyHKEgZeR (a Design canvas), saved here so the design can't get lost.

- `canvas.json` — the canvas layout (desktop and phone frames, notes).
- `Main.dc.html` — the whole flow in one file: home, size, dates, extras, details, pay, confirmation. All the copy, upsell logic and responsive rules (bottom bar under 900 px wide) are in here.
- `Mobile.dc.html` — the phone frame; it embeds `Main.dc.html` at 390 × 844.

They are design files, not site code. The real booking pages will be built in the Next.js app from this design and `../BOOKING-FLOW-DESIGN-SPEC.md`.

Images in the preview point to canvas uploads (`/_blob/...`). They are the same photos as these repo files:

| Preview image | Repo file |
| --- | --- |
| `/_blob/1a09d8b49126c65b09b8db17b42a91c1` | `public/images/jobs/hero-driveway.jpg` |
| `/_blob/b4acf6c45710a3de45527f0a0338af38` | `public/images/jobs/11-yard-small-driveway.jpg` |
| `/_blob/31c7071fba8a9febfbf1bdc37c268234` | `public/images/jobs/16-yard-newnan-garage.jpg` |
| `/_blob/e2b483b650dd35090024acbb7999fc4d` | `public/images/jobs/21-yard-peachtree-city.jpg` |
| `/_blob/511159a6fefe43e54d0364277413afdb` | `public/images/jobs/truck-delivering.jpg` |
| `/_blob/fb6a52c4fcdd9287b17eb120fdf5c1f3` | `public/images/brand/little-junkers-logo.png` |

When the preview changes in review, copy the updated files here and add a row to the spec's revision history in the same commit.
