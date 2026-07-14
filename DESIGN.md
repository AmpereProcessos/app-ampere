---
name: Ampère Energias Operations Platform
description: A calm, instrument-grade operations UI. Steady blue signal, amber for what needs attention.
colors:
  primary: "#15599a"
  primary-hover: "#124d87"
  primary-foreground: "#ffffff"
  accent-amber: "#fead41"
  accent-amber-hover: "#f0a11d"
  accent-amber-foreground: "#1a1200"
  ink: "#0a0a0a"
  muted-ink: "#737373"
  surface: "#ffffff"
  subtle: "#f5f5f5"
  border: "#e5e5e5"
  ring: "#15599a"
  destructive: "#d81f3f"
  destructive-foreground: "#ffffff"
  dark-surface: "#0a0a0a"
  dark-card: "#171717"
  dark-ink: "#fafafa"
  dark-border: "#272727"
typography:
  display:
    fontFamily: "Raleway, system-ui, sans-serif"
    fontSize: "2.25rem"
    fontWeight: 700
    lineHeight: 1.1
    letterSpacing: "-0.01em"
  headline:
    fontFamily: "Raleway, system-ui, sans-serif"
    fontSize: "1.5rem"
    fontWeight: 600
    lineHeight: 1.15
    letterSpacing: "-0.01em"
  title:
    fontFamily: "Raleway, system-ui, sans-serif"
    fontSize: "1.125rem"
    fontWeight: 600
    lineHeight: 1.3
  body:
    fontFamily: "Raleway, system-ui, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: 1.5
  label:
    fontFamily: "Raleway, system-ui, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 500
    lineHeight: 1.2
    letterSpacing: "0.01em"
rounded:
  sm: "6px"
  md: "8px"
  lg: "10px"
spacing:
  xs: "8px"
  sm: "12px"
  md: "16px"
  lg: "24px"
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.primary-foreground}"
    rounded: "{rounded.md}"
    padding: "8px 16px"
    height: "40px"
  button-primary-hover:
    backgroundColor: "{colors.primary-hover}"
  button-outline:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    rounded: "{rounded.md}"
    padding: "8px 16px"
    height: "40px"
  button-ghost:
    backgroundColor: "{colors.subtle}"
    textColor: "{colors.ink}"
    rounded: "{rounded.md}"
  button-destructive:
    backgroundColor: "{colors.destructive}"
    textColor: "{colors.destructive-foreground}"
    rounded: "{rounded.md}"
    padding: "8px 16px"
    height: "40px"
  card:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    rounded: "{rounded.lg}"
    padding: "24px"
  input:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    rounded: "{rounded.md}"
    padding: "8px 12px"
    height: "40px"
  badge-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.primary-foreground}"
    rounded: "{rounded.md}"
    padding: "2px 8px"
  badge-attention:
    backgroundColor: "{colors.accent-amber}"
    textColor: "{colors.accent-amber-foreground}"
    rounded: "{rounded.md}"
    padding: "2px 8px"
---

# Design System: Ampère Energias Operations Platform

## 1. Overview

**Creative North Star: "The Control Room"**

This is instrument-grade software. People sit in front of it for hours moving high-volume work through commercial, engineering, works, warehouse, monitoring, and finance. The interface behaves like a well-designed control room: calm at rest, dense with information, and completely legible under pressure. Blue is the steady signal that says "this is Ampère and everything is nominal." Amber is reserved, it only appears where something needs a human's attention. Nothing glows, pulses, or decorates for its own sake.

The system is built on a shadcn/Radix foundation with Tailwind v4, HSL design tokens, and the Raleway typeface, but it explicitly rejects the stock-shadcn-default look: the near-black "primary" and single-blue-button template that ships out of the box. Here the primary action is Ampère blue (`#15599a`), and the palette is disciplined, not neutral-by-accident. It equally rejects the dated enterprise/SAP aesthetic, no cramped gray toolbars, no tiny icons, no density without hierarchy. Surfaces breathe through spacing and type scale, not through chrome.

Density adapts across two hands: back-office staff on wide monitors get information-rich tables and forms; field technicians on smaller screens get the same language at a comfortable touch scale. The system stays coherent either way.

**Key Characteristics:**
- Calm blue signal, amber strictly for attention (never decoration)
- Flat-by-default surfaces that lift only on interaction
- Dense but hierarchical: scale and weight do the work, not borders and boxes
- Crisp, efficient components with fast, subtle state changes
- WCAG AA contrast and reduced-motion respect are non-negotiable

## 2. Colors

A tinted-neutral canvas anchored by Ampère blue, with amber held in reserve as the single attention color.

### Primary
- **Ampère Signal Blue** (`#15599a`): The brand anchor and the primary action color. Every default button, active nav item, focus ring, selected state, and key data accent. This replaces the stock near-black primary. It is the "everything is nominal" color, present and confident but not loud.
- **Signal Blue Deep** (`#124d87`): Hover/pressed state for primary surfaces. A darker step of the same hue, never a different color.

### Secondary
- **Attention Amber** (`#fead41`): The reserved highlight. Warnings, pending states, "needs review" flags, the single most important call-to-attention on a screen, and sparing brand trim. Its scarcity is what gives it meaning. On amber, text is near-black ink (`#1a1200`) for AA contrast, never white.
- **Attention Amber Deep** (`#f0a11d`): Hover/pressed step for amber surfaces.

### Neutral
- **Ink** (`#0a0a0a`): Primary text on light surfaces. A near-black tinted toward the neutral, never pure `#000`.
- **Muted Ink** (`#737373`): Secondary text, captions, table meta, placeholder text.
- **Surface** (`#ffffff`): Card and page background in light theme.
- **Subtle** (`#f5f5f5`): Secondary/ghost fills, hovered rows, muted panel backgrounds.
- **Border** (`#e5e5e5`): Dividers, input strokes, table lines. Hairline and quiet.
- **Dark Surface** (`#0a0a0a`) / **Dark Card** (`#171717`) / **Dark Ink** (`#fafafa`) / **Dark Border** (`#272727`): The dark-theme counterparts. Tokens are defined in HSL under `:root` and `.dark` in `styles/globals.css`; both themes must hold AA contrast.

### Feedback
- **Destructive Red** (`#d81f3f`): Delete, irreversible, and error states only. In money-critical flows it must be unmistakable.

### Named Rules
**The Amber Scarcity Rule.** Amber (`#fead41`) is the only attention color, and it appears on at most one thing per view. If two things are amber, nothing is. Never use amber as a decorative accent, a background wash, or a second brand color competing with blue.

**The One-Hue Hover Rule.** State changes shift lightness within the same hue (blue → deep blue), never swap to a different color. Hover is a darker step, never a new identity.

## 3. Typography

**Display / Body / Label Font:** Raleway (with `system-ui, sans-serif` fallback). A single humanist sans carries the entire system.

**Character:** Raleway is clean, slightly geometric, and highly legible at small sizes, which is exactly what dense tables and forms need. One family, differentiated by weight and scale, keeps the interface calm and coherent. Hierarchy comes from a ≥1.25 scale ratio and weight contrast, never from decorative faces.

### Hierarchy
- **Display** (700, 2.25rem, line-height 1.1): Page-level heroes and report titles. Rare; most screens never use it.
- **Headline** (600, 1.5rem / `text-2xl`, line-height 1.15): Card titles and primary section headers. The workhorse heading.
- **Title** (600, 1.125rem, line-height 1.3): Sub-section headers, dialog titles, grouped-form headings.
- **Body** (400, 0.875rem / `text-sm`, line-height 1.5): The default UI text size, table cells, form values, descriptions. Cap prose at 65–75ch.
- **Label** (500, 0.75rem / `text-xs`, letter-spacing 0.01em): Form labels, badges, table column headers, meta. There is also an `xxs` (0.5rem) step reserved for the tightest data annotations only.

### Named Rules
**The Weight-Over-Size Rule.** In dense views, prefer a weight step (400 → 600) over a size jump to signal hierarchy. It preserves vertical rhythm in tables and forms where every row of height counts.

## 4. Elevation

The system is flat by default. Surfaces sit on the canvas with a hairline border and, at most, an extremely subtle resting shadow (`shadow-xs`). Depth is a response to interaction, not a decorative default. This is what keeps a dense screen calm: no drop-shadow soup, no stacked cards floating over cards.

### Shadow Vocabulary
- **Resting** (`box-shadow: 0 1px 3px 0 hsl(0 0% 0% / 0.05)`): Cards and raised panels at rest. Barely there; it separates the surface from the canvas without announcing itself.
- **Interactive** (`box-shadow: 0 1px 3px 0 hsl(0 0% 0% / 0.1), 0 2px 4px -1px hsl(0 0% 0% / 0.1)`): Dropdowns, popovers, dialogs, and hover-lifted elements. Structural, signals "this floats above the page."

### Named Rules
**The Flat-By-Default Rule.** Surfaces are flat at rest. Shadow appears only as a response to state (hover, open, focus, elevation). If it looks like a 2014 app, the shadow is too dark and the blur is too small.

**The No Nested Cards Rule.** A card never contains another card. Group with spacing, dividers, or subtle (`#f5f5f5`) fills instead.

## 5. Components

Components are crisp and efficient: tight radii, minimal shadow, fast state changes. Built on the shadcn/Radix primitives in `components/ui/`.

### Buttons
- **Shape:** Gently rounded (`rounded-md`, 8px). Default height 40px (`h-10`); sizes range xs (28px) to xl (48px).
- **Primary:** Ampère Signal Blue fill (`#15599a`) with white text, padding 8px 16px. The default action.
- **Hover / Focus:** Hover darkens to `#124d87` (primary/90) with a fast `transition-colors`. Focus shows a 2px blue ring offset from the surface (`focus-visible:ring-2 ring-ring ring-offset-2`).
- **Outline:** White surface, hairline border (`#e5e5e5`), ink text; hover fills with subtle (`#f5f5f5`). For secondary actions.
- **Ghost:** No border or fill at rest; hover fills subtle. For low-emphasis and toolbar actions.
- **Destructive:** Red fill (`#d81f3f`), white text. Delete and irreversible only.

### Badges
- **Style:** Small `rounded-md` pills, `text-xs` 500 weight, `px-2 py-0.5`, transparent border.
- **State:** Primary (blue) for identity/status tags; **Attention (amber)** for the one thing that needs review, following the Amber Scarcity Rule; secondary (subtle gray) for neutral metadata; destructive (red) for error/blocked.

### Cards / Containers
- **Corner Style:** `rounded-lg` (10px).
- **Background:** Surface white (`#ffffff`) in light, `#171717` in dark.
- **Shadow Strategy:** `shadow-xs` at rest (see Elevation). No heavier shadow unless interactive.
- **Border:** Hairline (`#e5e5e5`).
- **Internal Padding:** 24px (`p-6`); header/content/footer share the same rhythm.

### Inputs / Fields
- **Style:** Hairline border (`#e5e5e5`), white background, `rounded-md` (8px), 40px height, `text-sm` value.
- **Focus:** 2px blue ring offset from the surface. The focus state must be unmistakable for keyboard and power users.
- **Disabled:** Cursor not-allowed, 50% opacity. Placeholder text uses muted ink (`#737373`).

### Navigation
- **Style:** Sidebar-led app shell (`--sidebar` tokens). Nav items are `text-sm`; default is muted, hover fills subtle, active item carries Ampère blue (text or left-anchored blue indicator via full treatment, never a thick colored side-stripe).
- **Mobile:** Collapses to a drawer/sheet; same type and state language at touch scale.

### Data Tables (Signature)
The most-used surface in the app. Rows are `text-sm`, column headers are `label` weight, borders are hairline. Row hover fills subtle (`#f5f5f5`). Status is carried by badges, not by row background color, except a single amber-tinted row is permitted for the one item needing attention. Keep row height compact but tap-safe; never sacrifice AA contrast for density.

## 6. Do's and Don'ts

### Do:
- **Do** use Ampère blue (`#15599a`) as the primary action color on every default button and active state. It is the brand signal.
- **Do** reserve amber (`#fead41`) for attention only, at most one element per view, with near-black text on it for AA contrast.
- **Do** keep surfaces flat at rest and let shadow respond to interaction (`shadow-xs` resting, heavier only when floating).
- **Do** build hierarchy with the Raleway weight/scale steps; prefer a weight step over a size jump in dense tables.
- **Do** give every input and interactive element a clearly visible 2px blue focus ring, and honor `prefers-reduced-motion`.
- **Do** hold WCAG AA contrast in both light and dark themes.

### Don't:
- **Don't** ship the stock-shadcn-default look: a near-black "primary" with one lonely blue button. The primary is Ampère blue, on purpose.
- **Don't** fall into dated enterprise/SAP density: cramped gray toolbars, tiny icons, and density without hierarchy are forbidden.
- **Don't** bring flashy consumer-marketing polish into the work tool, no big gradients, hero animations, or gradient text (`background-clip: text` is banned).
- **Don't** use a `border-left`/`border-right` colored stripe greater than 1px as an accent on cards, rows, or callouts. Use full hairline borders, subtle fills, or a leading badge/icon instead.
- **Don't** nest a card inside a card, or stack decorative drop shadows.
- **Don't** let amber compete with blue as a second brand color, and never swap hue on hover (darken the same hue instead).
