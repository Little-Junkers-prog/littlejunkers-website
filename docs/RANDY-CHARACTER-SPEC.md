# Randy Character Design Specification

**Status:** Locked visual direction for V2
**Date:** September 29, 2026
**Applies to:** Website, booking/customer experience, Randy chat surfaces, marketing illustrations where Randy is used
**Brand authority:** `LittleJunkers-BrandGuide-v1.0.docx` plus current project governance

---

# 1. Purpose

Randy is Little Junkers' digital rental assistant. The cartoon character is a visual identity for the assistant, not a depiction of a live human agent.

Randy should feel:
- friendly;
- confident;
- helpful;
- local;
- competent;
- approachable without looking childish.

The character must remain visually consistent across every page and product surface.

---

# 2. Canonical Character Appearance

Randy is a **Black adult male**.

Locked visual traits:
- medium-to-deep brown skin tone;
- short black hair;
- neatly trimmed black beard and mustache;
- warm brown eyes;
- friendly, confident facial expression;
- average-to-athletic build;
- professional but approachable appearance;
- clean commercial cartoon proportions, not exaggerated caricature.

Do not change Randy's apparent race, skin tone family, face shape, beard style, age range, or core proportions between illustrations.

Avoid:
- photorealism;
- anime styling;
- childlike/chibi proportions;
- extreme muscularity;
- exaggerated facial features;
- random tattoos, jewelry, sunglasses, or props not required by the pose.

---

# 3. Outfit

## Hat

- Black work/baseball cap.
- Front mark is the **approved Little Junkers raccoon logo**.
- Do **not** use `LJ` lettering on the hat.
- Do not substitute a generic raccoon.
- Preserve the approved raccoon mark's recognizable proportions and visual identity.
- The logo may be simplified only as necessary for very small avatar sizes.

## Shirt

- Black short-sleeve polo/work shirt.
- Little Junkers wordmark/logo on the left chest.
- No large back graphic in standard UI illustrations.
- Keep branding readable but secondary to Randy's face.

## Bottoms / footwear

For full-body uses:
- dark charcoal, black, or very dark indigo work jeans/pants;
- clean dark work boots in black or a dark neutral brown;
- no jewelry, chains, watches, bracelets, rings, or decorative adornments;
- no unnecessary tools or props.

Randy should look tidy, friendly, capable, and professional. The full-body reference may be used sparingly for scale/height-comparison illustrations beside dumpsters and similar educational visuals.

Do not present a Randy-to-dumpster illustration as a literal dimensional comparison until a canonical Randy height has been explicitly defined. Until then, any such composition is illustrative only.

The standard chat avatar and modal art normally use head-and-shoulders or waist-up crops, so the lower-body outfit is not required in every asset.

---

# 4. Illustration Style

Use one consistent commercial cartoon style:

- polished 2D / lightly dimensional vector-style illustration;
- clean, controlled outlines;
- subtle shading;
- realistic adult proportions;
- expressive face without exaggerated cartoon distortion;
- crisp enough for both large modal art and small circular avatars.

Do not drift between:
- flat vector;
- photorealistic portrait;
- 3D/Pixar-like render;
- comic-book style;
- sketch style.

One master character reference should be used to derive all future poses.

---

# 5. Brand Colors

Randy art and surrounding UI must use the Little Junkers brand palette, not invented bright-magenta variants.

Canonical colors:

- Signature Pink: `#FFCEE4`
- Dark Hero: `#1E1C19`
- Page Background: `#EDEAE4`
- Surface Background: `#FAF8F5`
- Card Background: `#FFFFFF`
- Ink Primary: `#1A1A1A`
- Ink Mid: `#555555`
- Ink Muted: `#999999`
- Pink Text: `#C2587A`
- Pink Bar: `#FFB3D4`
- Pink Background: `#FFF5FB`
- Border Card: `#E5E0D8`
- Border Surface: `#E8E3DB`
- Warning Background: `#FFF8EB`
- Warning Border: `#F2CF7A`

Rules:
- Signature Pink is an accent, not a giant full-field background.
- Do not introduce purple, blue, or green CTA colors into Randy UI.
- Randy's standard clothing remains primarily black/dark neutral.
- Approved seasonal variants may temporarily alter Randy's shirt or hat as defined in the Seasonal Variants section.
- Pink accents should connect the character to the brand without turning Randy into a pink character outside an approved seasonal treatment.

---

# 6. Typography Around Randy

Randy artwork should not contain baked-in UI copy whenever avoidable.

All UI copy, chat labels, modal headings, button text, and speech content should be rendered by the application using the site font stack:

```css
system-ui, -apple-system, sans-serif
```

Use the existing V2 type hierarchy and weights. Do not introduce a special cartoon/display font just for Randy.

Handwritten-style annotations may be used sparingly in marketing mockups only; they are not part of the production Randy chat UI.

---

# 7. Canonical Expressions

Approved recurring expressions:

1. **Friendly** — default avatar / welcome.
2. **Thinking** — recommendation or complex question.
3. **Helpful** — explaining a rule or next step.
4. **Positive / confident** — successful recommendation or handoff.
5. **Concerned / caution** — weight, prohibited material, or risk warning; calm, never alarmist.

Avoid goofy, shocked, angry, sarcastic, or overexcited expressions.

---

# 8. Canonical Poses

Approved recurring poses:

- neutral head-and-shoulders;
- pointing toward nearby UI;
- waving/welcome;
- holding phone;
- explaining with open hand;
- thinking pose;
- caution/attention pose.

Every new pose must preserve the same face, hair, beard, hat, logo treatment, body proportions, and illustration style.

---

# 9. Seasonal Variants

Seasonal Randy variants are approved as a controlled extension of the canonical character. They are intended to keep the website and assistant experience fresh without turning Randy into a costume character.

Core rule:
- Randy's face, skin tone, hair, beard, body proportions, illustration style, professionalism, and official Little Junkers identity never change.
- Seasonal treatments may change only one or two apparel/accessory elements unless specifically approved otherwise.
- No seasonal variant may imply a charity partnership, sponsorship, donation, endorsement, or organizational affiliation that does not actually exist.
- The raccoon remains a logo/mascot element only and is never Randy's companion, pet, or sidekick.

## Standard/default Randy

Used whenever no seasonal window is active:
- black/dark Little Junkers polo;
- black cap with approved raccoon logo;
- dark pants/work jeans for full-body art;
- dark work boots.

## Valentine's Day

Annual window: **February 10-14**

Treatment:
- standard dark polo;
- Signature Pink `#FFCEE4` cap or a very small approved pink heart/accent;
- no oversized hearts, novelty costumes, or romantic copy built into the artwork.

## Fourth of July

Annual window: **July 1-4**

Treatment:
- standard dark polo;
- restrained red/white/blue cap treatment or small patriotic accent;
- do not turn Randy into an Uncle Sam character;
- no flag costume or oversized patriotic props.

## October / Breast Cancer Awareness Month

Annual window: **October 1-31**

Treatment:
- Signature Pink `#FFCEE4` polo;
- Dark Hero `#1E1C19` Little Junkers lettering/raccoon logo treatment;
- standard dark cap unless the Halloween overlay below is active;
- no awareness ribbon or third-party awareness logo unless separately approved;
- no copy or visual treatment implying Little Junkers is an official partner, sponsor, fundraiser, or donor unless that becomes factually true.

This is a subtle brand-color acknowledgment only.

## Halloween overlay

Annual window: **October 25-31**

This overlays the October awareness treatment rather than replacing it.

Treatment:
- retain the October Signature Pink polo;
- use a restrained Halloween cap/brim accent or similarly small seasonal hat treatment;
- no face paint, masks, fangs, horror imagery, or full costume.

## Fall / Thanksgiving

Annual window: **November 1-30**

Treatment:
- standard dark polo;
- warm cream/tan knit cap or restrained fall cap treatment;
- no turkey costume, pilgrim costume, or novelty food props.

## Christmas

Annual window: **December 1-25**

Treatment:
- standard dark Little Junkers polo;
- traditional red-and-white Santa-style hat;
- no Christmas sweater, elf costume, presents, ornaments, or extra decorative clutter unless separately approved.

## Variant precedence

When seasonal windows overlap, use this priority:
1. Halloween overlay;
2. October Awareness;
3. Christmas;
4. Fall / Thanksgiving;
5. Fourth of July;
6. Valentine's Day;
7. Standard/default.

The October Halloween overlay intentionally keeps the pink October polo and changes only the seasonal headwear/accent.

## Implementation rule

Seasonal selection should be centralized in one reusable configuration/helper rather than implemented as scattered page-specific date checks.

The selector should:
- use the Little Junkers operating timezone;
- evaluate the current local calendar date;
- return one canonical Randy variant key;
- fall back to `standard` outside approved windows;
- allow a future explicit override for testing/preview without changing production dates.

Initial variant keys:

```text
standard
valentines
fourth_of_july
october_awareness
halloween
fall_thanksgiving
christmas
```

Do not create additional seasonal variants without updating this specification first.

---

# 10. Website Usage

## Homepage

The homepage may use a larger Randy illustration because it introduces the assistant as a product feature.

## All other public pages

Use a persistent **Randy chat bubble** rather than a large in-page Randy promotional panel.

Chat bubble:
- fixed bottom corner;
- circular head-and-shoulders avatar;
- Randy wears the black raccoon-logo hat;
- accessible label such as **Ask Randy**;
- must not obscure primary mobile CTAs or cookie/privacy controls.

Interaction:
- tap/click launches the Randy chat experience in a **full-screen modal on mobile**;
- desktop may use a large modal/dialog that still feels like a focused chat experience;
- modal must support keyboard navigation, focus trapping, escape/close behavior, and screen-reader labeling.

The bubble must be visually consistent sitewide.

---

# 11. Chat Modal Visual Treatment

Suggested production treatment:

- dark `#1E1C19` header or strong dark framing;
- Randy waist-up illustration in the header/welcome state;
- `#FAF8F5` / `#FFFFFF` conversation surfaces;
- `#FFCEE4` for primary accents/actions;
- `#1A1A1A` primary text;
- minimal decorative illustration once conversation begins so the content remains easy to scan.

Do not make the chat window look like a separate third-party product.

---

# 12. Asset Requirements

A final Randy asset set should include:

1. master hero portrait;
2. circular chat avatar;
3. waist-up neutral;
4. waist-up pointing;
5. waist-up waving;
6. waist-up thinking;
7. waist-up explaining;
8. waist-up caution;
9. full-body front reference;
10. 3/4-body reference.

Preferred production formats:
- SVG where illustration workflow supports clean vector export;
- otherwise high-resolution transparent PNG/WebP masters with derived responsive assets.

The raccoon hat logo and Little Junkers shirt logo should use approved source artwork rather than being re-invented by the image model.

---

# 13. Generation / Creative Prompt Guardrails

Any future image-generation prompt for Randy must explicitly include:

- Black adult male;
- medium-to-deep brown skin;
- short black hair;
- neatly trimmed black beard and mustache;
- black cap with the approved Little Junkers raccoon logo, **no LJ letters**;
- black Little Junkers polo;
- same canonical face and proportions as the master reference;
- Little Junkers approved color palette;
- polished 2D commercial cartoon style;
- no photorealism;
- no tattoos unless later explicitly approved;
- no random accessories;
- no alternate logos;
- no companion raccoon;
- seasonal apparel only when using an approved seasonal variant from this specification.

Generated variants are not automatically canonical. They must be checked against the master reference before use.

---

# 14. Character Governance

The master Randy reference and this specification are the source of truth.

Do not allow separate page teams, image generators, or AI agents to independently reinterpret Randy.

If Randy's canonical appearance changes:
1. update this document;
2. update the master reference asset;
3. regenerate/re-export affected UI assets;
4. document the change in the project change log/strategy record.
