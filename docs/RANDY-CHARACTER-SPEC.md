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
- dark work jeans/pants;
- brown or dark neutral work boots.

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
- Randy's clothing remains primarily black/dark neutral.
- Pink accents should connect the character to the brand without turning Randy into a pink character.

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

# 9. Website Usage

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

# 10. Chat Modal Visual Treatment

Suggested production treatment:

- dark `#1E1C19` header or strong dark framing;
- Randy waist-up illustration in the header/welcome state;
- `#FAF8F5` / `#FFFFFF` conversation surfaces;
- `#FFCEE4` for primary accents/actions;
- `#1A1A1A` primary text;
- minimal decorative illustration once conversation begins so the content remains easy to scan.

Do not make the chat window look like a separate third-party product.

---

# 11. Asset Requirements

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

# 12. Generation / Creative Prompt Guardrails

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
- no alternate logos.

Generated variants are not automatically canonical. They must be checked against the master reference before use.

---

# 13. Character Governance

The master Randy reference and this specification are the source of truth.

Do not allow separate page teams, image generators, or AI agents to independently reinterpret Randy.

If Randy's canonical appearance changes:
1. update this document;
2. update the master reference asset;
3. regenerate/re-export affected UI assets;
4. document the change in the project change log/strategy record.
