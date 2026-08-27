---
name: Dentsu Data Artist Mongol
description: A calibrated dark instrument panel for an AI and data consultancy — monospace registration marks, full-bleed bands, and point-field artwork.
colors:
  ink: "#111111"
  carbon: "#090909"
  graphite: "#1b1b1b"
  bone: "#f4f4f4"
  ash: "#dadada"
  fog: "#cccccc"
  rule: "#555555"
  dim: "#999999"
  paper: "#e7e7e7"
  ember: "#ed6d40"
  steel: "#6d96a2"
  signal-blue: "#1863dc"
  deep-blue: "#0056a7"
typography:
  display:
    fontFamily: "Roc Grotesk, Archivo, Helvetica Neue, Helvetica, Arial, sans-serif"
    fontSize: "clamp(2.5rem, 7.2vw, 6.5rem)"
    fontWeight: 500
    lineHeight: 0.94
    letterSpacing: "-0.02em"
  headline:
    fontFamily: "Roc Grotesk, Archivo, Helvetica Neue, Helvetica, Arial, sans-serif"
    fontSize: "clamp(1.75rem, 3.4vw, 3rem)"
    fontWeight: 700
    lineHeight: 1.05
    letterSpacing: "-0.02em"
  title:
    fontFamily: "Roc Grotesk, Archivo, Helvetica Neue, Helvetica, Arial, sans-serif"
    fontSize: "20px"
    fontWeight: 400
    lineHeight: 1.4
    letterSpacing: "normal"
  body:
    fontFamily: "Roc Grotesk, Archivo, Helvetica Neue, Helvetica, Arial, sans-serif"
    fontSize: "clamp(1rem, 1.1vw, 1.25rem)"
    fontWeight: 400
    lineHeight: 1.65
    letterSpacing: "normal"
  label:
    fontFamily: "Azeret Mono, ui-monospace, SFMono-Regular, Menlo, monospace"
    fontSize: "12px"
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: "0.16em"
  micro:
    fontFamily: "Azeret Mono, ui-monospace, SFMono-Regular, Menlo, monospace"
    fontSize: "11.008px"
    fontWeight: 400
    lineHeight: 1.75
    letterSpacing: "0.05em"
rounded:
  hairline: "1px"
  sm: "3.008px"
  md: "4px"
  lg: "6px"
  pill: "8px"
  xl: "20px"
spacing:
  gutter: "24px"
  stack: "36px"
  band-tight: "112px"
  band: "128px"
  band-loose: "176px"
components:
  bracket-link:
    textColor: "{colors.ash}"
    typography: "{typography.label}"
    padding: "16px 32px"
    rounded: "0"
  bracket-link-hover:
    textColor: "{colors.ash}"
  orbit-stage:
    backgroundColor: "{colors.ash}"
    textColor: "{colors.ink}"
    rounded: "0"
    padding: "0 24px"
  stat-cell:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.bone}"
    rounded: "{rounded.md}"
    padding: "32px"
  nav-link:
    textColor: "{colors.ash}"
    typography: "{typography.label}"
  nav-link-hover:
    textColor: "{colors.bone}"
  header-capsule:
    backgroundColor: "{colors.graphite}"
    textColor: "{colors.bone}"
    rounded: "{rounded.pill}"
    padding: "12px 24px"
---

# Design System: Dentsu Data Artist Mongol

## Overview

**Creative North Star: "The Instrument Panel"**

This is the interface of a measuring apparatus, not a brochure. The page sits on near-black (#111111) the way a calibrated instrument sits in a darkened room, and every element behaves like part of a readout: monospace labels in wide tracking annotate each band the way a legend annotates a gauge; calls to action are framed by four corner brackets that read as registration marks rather than buttons; the artwork is not illustration but point-field — rotating dot spheres and lattice, wave, burst and ribbon fields that stand in for data as visible physical matter. The company's stated position is that models are only worth what they change, and the surface argues that case by looking like something that measures rather than something that decorates.

The register is calibrated and quietly technical, never cold. Warmth arrives structurally, not decoratively: the page pushes through a light band (#dadada) after the hero — first the ethos statement, then the pinned service orbit that runs on the same ground — and returns to dark — so the document breathes in bands rather than scrolling as one uninterrupted dark field. Ember (#ed6d40) is the one hot note in the system, and it is spent deliberately: one full-colour recruitment band and the kicker colour in the news list. Type is uppercase grotesque at scale for statements and sentence-case only in body copy, so headlines read as plate engraving and paragraphs stay readable.

Density is generous. Bands run 112–176px of vertical padding inside a 1600px maximum measure with a 24px gutter, and content is set on two- or three-column grids that collapse to a single stacked column. Nothing is crowded; the empty ground is doing work. Motion is a first-class material — a launch overlay whose seam parts on first visit, scroll reveals that rise 22px into place on a signature overshoot easing (`cubic-bezier(0.62, 0.16, 0.13, 1.01)`), panels that wipe up from their own bottom edge via `clip-path`, a header that collapses into a floating capsule, and a pinned orbit whose practices hand off one at a time as it scrolls. Every one of these has a `prefers-reduced-motion` opt-out and a no-JavaScript fallback, and that is not a courtesy: it is part of the system.

**Key Characteristics:**
- Near-black ground with tonal steps, not shadows, as the primary depth mechanism
- Monospace uppercase labels in 0.12–0.18em tracking as the system's connective tissue
- Corner-bracket registration marks in place of conventional buttons
- Full-bleed colour panels that butt edge to edge with zero radius
- SVG point-field artwork as the only imagery — no photography, no stock illustration
- Uppercase grotesque display type with negative tracking (−0.02em) and sub-1.05 leading
- Band-based vertical rhythm that alternates dark, light, colour, dark
- Motion with a single house easing and a universal reduced-motion path

## Colors

A near-monochrome instrument palette — five steps of dark grey through bone white — punctuated by exactly three chromatic notes that each own one job.

### Primary
- **Ink** (`#111111`): The default page ground and the background of the hero, about, network and contact bands. Everything else is positioned relative to this value.
- **Bone** (`#f4f4f4`): The brightest text tone, reserved for headlines, the wordmark, and the logo mark. Its rarity relative to Ash is what makes headlines land.

### Secondary
- **Ember** (`#ed6d40`): The system's one hot note. It carries the full-colour careers band and news kickers. Nothing else.
- **Steel** (`#6d96a2`): A muted blue-grey held in reserve as the calm counterweight to Ember. Spend it on a full band, never on a small element.

### Tertiary
- **Signal Blue** (`#1863dc`): Text-selection highlight only. It is the one moment of pure saturated blue in the system and it belongs to the browser, not the layout.
- **Deep Blue** (`#0056a7`): Available in the token set, currently unspent. Reserve it for a future state colour rather than decoration.

### Neutral
- **Carbon** (`#090909`): The deepest step, used for the footer and a floor beneath Ink.
- **Graphite** (`#1b1b1b`): One step up from Ink, used for the news band and the scrolled header capsule (at 85% with a backdrop blur).
- **Ash** (`#dadada`): The default body and navigation text tone on dark, and the light band's background under the ethos statement and the service orbit. The same value doing both jobs is deliberate — it ties the inverted band to the dark one.
- **Fog** (`#cccccc`): Long-form body copy on dark grounds, one step softer than Ash so paragraphs sit below headlines without a size change.
- **Paper** (`#e7e7e7`): The lightest surface in the system, for a band that has to sit above Ash without going white.
- **Rule** (`#555555`): Every hairline divider and border in the system, always at 40–60% opacity.
- **Dim** (`#999999`): Monospace labels, eyebrow text, metadata and timestamps. It is the annotation tone.

### Named Rules

**The One Hot Note Rule.** Ember is the only warm colour in the system and it appears at most three times per page. If a fourth element wants Ember, the answer is Ash or a tonal step, not another accent hue.

**The Tonal Step Rule.** Adjacent dark surfaces separate by one tonal step (#090909 → #111111 → #1b1b1b), never by a shadow and never by more than one step at a time. A band that needs more separation than one step needs a colour change, not a darker grey.

**The Annotation Rule.** Dim (#999999) means "this text is a label, not content." Never set body copy in it, and never set a label in Ash or Bone.

## Typography

**Display Font:** Roc Grotesk (licensed), falling through to Archivo (OFL, self-hosted), then Helvetica Neue / Helvetica / Arial
**Body Font:** the same display stack — this is a single-grotesque system
**Label/Mono Font:** Azeret Mono, falling through to ui-monospace / SFMono-Regular / Menlo

**Character:** One wide neo-grotesque doing everything from a 6.5rem hero statement down to a 14px footer link, paired against a geometric monospace that handles every label, timestamp and eyebrow. The contrast is not serif-versus-sans; it is *statement versus instrumentation*. The grotesque speaks, the monospace annotates.

Every entry in the font stacks carries its own `var()` fallback, because an undefined custom property invalidates the whole declaration at computed-value time and would otherwise drop the entire stack to Times. Preserve that pattern when adding faces.

### Hierarchy
- **Display** (500, `clamp(2.5rem, 7.2vw, 6.5rem)`, 0.94 leading, −0.02em, uppercase): The hero headline only, split across two lines with the second set right so the rotating point cloud shows through the gap.
- **Headline** (700 on light and colour grounds, 500 on dark, `clamp(1.75rem, 3.4vw, 3rem)`, 1.05 leading, −0.02em, uppercase): Every section title. The weight shift between grounds is deliberate optical compensation, not inconsistency.
- **Title** (400, 20px, 1.4 leading): News item titles and office names — the largest non-uppercase type in the system.
- **Body** (400, `clamp(1rem, 1.1vw, 1.25rem)`, 1.65 leading, max ~2xl measure): Section standfirsts and paragraphs. Sentence case, always.
- **Label** (400, 12px, 0.12–0.18em tracking, uppercase, monospace): Section eyebrows, navigation, bracket-link text, table terms, news kickers. The single most repeated type treatment in the system.
- **Micro** (400, 11px, 0.05em tracking, 1.75 leading, uppercase, monospace): The hero standfirst and footer descriptive copy — the one place uppercase monospace runs to a full sentence.

### Named Rules

**The Two Voices Rule.** Grotesque states, monospace annotates. If text describes, categorises, timestamps or labels, it is monospace uppercase with tracking. If it argues or informs, it is the grotesque. There is no third face.

**The Tracking Inversion Rule.** Type tightens as it grows and loosens as it shrinks: display and headline sit at −0.02em; 12px labels sit at +0.16em. Never ship a large uppercase headline at positive tracking or a small mono label at zero.

**The Sentence-Case Body Rule.** Uppercase is for statements and labels. Any paragraph longer than two lines is sentence case — except the hero standfirst and footer blurb, which are deliberate micro-monospace exceptions.

## Layout

The page is a stack of full-bleed **bands**, each one owning its background colour. Content inside a band is centred in a `1600px` maximum measure with a `24px` horizontal gutter that never changes across breakpoints — the gutter staying fixed while the measure grows is what makes wide screens feel composed rather than stretched.

Vertical rhythm runs on three band heights: tight (`112px` top and bottom, used for the careers band), standard (`128px`, used for about, news, network and contact), and loose (`176px` top, used for the ethos band immediately after the hero, so the light break gets extra air). The hero is the exception: full `min-h-svh` with a `128px` top inset for the fixed header and its standfirst pinned as a footer strip on the fold line.

The internal grid is almost always **two columns on `md` and up** — a left column carrying the eyebrow and headline, a right column carrying the standfirst and its call to action, separated by an 80px gap and topped by a hairline rule on the right column only. That asymmetric rule is a recurring signature. Variations: the network band goes two-up at `lg` with a 96px gap; the stats and contact details go three-up; the footer runs `1.4fr` plus three equal columns; the service orbit has no internal grid at all — one centred column inside a pinned stage.

Everything collapses to a single stacked column below `md`. The service orbit is already one column at every width; only its artwork steps down a size.

Anchor targets carry `scroll-margin-top: 6rem` because the header is fixed.

### Named Rules

**The Fixed Gutter Rule.** The 24px page gutter is constant at every breakpoint. Responsive change happens in the measure, the column count and the band height — never in the gutter.

**The Asymmetric Rule Rule.** In the two-column section pattern, the hairline sits above the right column only. Never rule both columns; the imbalance is the point.

## Elevation & Depth

The system is **flat at rest**. Depth is carried entirely by tonal layering — Carbon under Ink under Graphite, with Ash and Paper inverting the field — and by hairline `#555555` borders at 40–60% opacity. Surfaces do not float, and no card, panel or band carries a shadow in its default state.

Shadows exist as a **response to state**, not as a property of a surface. The four tokens below are available for hover, focus and true overlay elevation. The scrolled header capsule is the system's one standing exception: it uses an 85%-opacity Graphite fill plus `backdrop-filter: blur(12px)` rather than a shadow, because it overlaps live content and needs to separate optically without adding a second visual language.

### Shadow Vocabulary
- **Hairline halo** (`box-shadow: rgb(136, 136, 136) 0px 0px 1px 0px`): A one-pixel edge definition on light grounds where a border would be too heavy.
- **Ambient lift** (`box-shadow: rgba(172, 171, 171, 0.3) 0px -1px 10px 0px`): Upward-cast diffuse glow, for elements that rise on hover.
- **Deep drop** (`box-shadow: rgba(0, 0, 0, 0.3) 0px 32px 68px 0px`): True overlay elevation — modals, dialogs, floating menus. Never on inline content.
- **Contact edge** (`box-shadow: rgba(0, 0, 0, 0.2) 1px 1px 4px 0px`): A tight offset for small interactive elements at rest on light grounds.

### Named Rules

**The Flat-At-Rest Rule.** No surface carries a shadow in its default state. If a resting element needs separation, it gets a tonal step or a hairline border. Shadows answer to hover, focus and overlay only.

## Shapes

The form language is **hard-edged by default**. Every full-bleed band and colour break has zero radius and butts directly against its neighbour — the seams between bands are the composition, so rounding them would dissolve it.

Radius appears only on contained interactive or data objects, and only at small values: `4px` (md) on the stat cells and profile table, `6px` (lg) where a slightly softer container is needed, and `8px` (pill) on the scrolled header capsule. The pill token is deliberately 8px rather than a true pill; the header capsule is a soft-cornered rectangle, not a lozenge. `1px` (hairline) and `3.008px` (sm) exist in the token set for micro-elements.

`20px` (xl) is currently unspent. It existed for the outer top corners of the old service-panel row; nothing in the page claims it now. Leave it that way unless a full-bleed block again needs its outer boundary softened — it is never for an internal seam.

Borders are the system's dominant edge treatment: always `1px`, always Rule (#555555), always at 40–60% opacity so they read as drawn lines rather than boxes. Grids of cells are built with `gap: 1px` over a Rule-tinted background so the dividers are the gaps themselves.

The recurring silhouette is the **corner bracket** — four two-sided pseudo-element corners drawn 12px square, never a closed outline. It is the system's signature geometry and appears wherever a call to action does.

### Named Rules

**The Butt-Joint Rule.** Full-bleed panels and bands butt directly against each other with no gap and no radius on any internal seam. There are no exceptions in the page today. Radius belongs to objects inside a band, never to the band itself.

**The Drawn-Line Rule.** A border is a 1px Rule hairline at 40–60% opacity. Never a solid 100% border, never 2px, never a colour other than Rule.

## Components

### Buttons

The system has no filled buttons. Its call to action is the **bracket link**.

- **Shape:** Zero radius; four corner brackets drawn as two-sided pseudo-boxes 12px square, inset to the element's bounds. The frame is never closed.
- **Primary:** 12px monospace uppercase at 0.18em tracking, `16px 32px` padding, colour inherited from `currentColor` so the brackets follow the surrounding surface's text colour automatically.
- **Hover / Focus:** Brackets grow from 12px to 16px square and the whole link drops to 70% opacity. Both transition on the house easing.
- **Text-only variant:** Monospace uppercase at 0.16em tracking with an opacity-to-70% hover, used for "All news →" and footer links.

### Cards / Containers

- **Corner Style:** 4px (md) on stat cells and the corporate profile table.
- **Background:** Ink for cells inside a dark band.
- **Shadow Strategy:** None at rest — see Elevation & Depth.
- **Border:** 1px Rule at 40% opacity around a cell group; internal dividers made with `gap: 1px` over a Rule-tinted background.
- **Internal Padding:** 32px in stat cells.

### Navigation

- **Style:** Five monospace uppercase links at 12px / 0.16em tracking in Ash, 40px apart, hidden below `md` behind a "Menu" trigger.
- **Hover:** Colour shifts Ash → Bone over 300ms. No underline, ever.
- **Scrolled state:** The whole bar collapses to a centred Graphite/85% capsule with a 12px backdrop blur, `8px` radius and `12px 24px` padding, over 500ms on the house easing.
- **Wordmark swap:** The two-line wordmark and the logo mark are stacked in one `overflow: hidden` box and the pair *slides* vertically between them. Never crossfade — a crossfade reads as a swap, a slide reads as one object moving.
- **Hide-on-scroll:** Past one full viewport, 50px of accumulated downward scroll translates the header out; 50px upward brings it back. Never hides while the hero is still on screen.
- **Mobile:** Full-screen Ink overlay with display-scale uppercase links and a "Close" label; body scroll is locked while open.

### Signature Component: Point-Field Artwork

The only imagery in the system. Two forms: a rotating **dot sphere** behind the hero headline, and flat **dot fields** in four variants (lattice, wave, burst, ribbon) — one per practice in the service orbit plus one in the network band. Each field is an SVG whose `<g>` bands carry their own offset and delay, so a single CSS rule ripples the whole field on hover of the host element (`.dot-art-host`), using `transform-box: view-box` so offsets resolve against the SVG coordinate system. Colour is always inherited. This is the system's substitute for photography and it must stay so.

### Signature Component: The Service Orbit

Four practices presented one at a time inside a stage pinned for the length of a tall track — one viewport per practice, plus a 12% tail that holds the last one before the pin releases. Two dotted ellipses (zero-length dashes under a round cap, so the stroke is made of the same dots as the artwork) sit behind the copy, tilted a few degrees off axis, with small triangles drifting along them: their angle is scroll progress plus a slow ambient turn, written straight to the SVG `transform` in a RAF loop so React renders them once and the drift costs no re-renders. The loop is gated on an IntersectionObserver and idles whenever the section is off screen.

The copy stacks in a single grid cell and crossfades on `data-active`, with the incoming card delayed 160ms so two paragraphs never overlap mid-fade. Under reduced motion the practices still follow the scroll — that is the visitor's own input — but they cut instead of fading and the ambient drift is dropped entirely.

### Signature Component: The Launch Intro

A first-visit overlay that covers the page for 1560ms and parts at a seam. Content marked `data-intro-gate` delays its reveal by `--intro-handoff` (1500ms) so hero animations play *into* the opening door rather than finishing behind it. Two escape hatches are mandatory: `intro-seen` is set before first paint from `sessionStorage` so repeat loads never flash the overlay, and `intro-done` fires the moment it completes or is skipped.

### Motion

One easing for everything: `cubic-bezier(0.62, 0.16, 0.13, 1.01)`, a slight overshoot at the end. Scroll reveals run 800ms, rising 22px with a per-child stagger; panels use a `clip-path: inset(0 0 100% 0)` wipe from their own bottom edge instead. State changes on the header and panels run 500ms. Reveal rules live entirely inside `@media (prefers-reduced-motion: no-preference)` so a reduced-motion visitor never receives the hidden start state at all, and a `<noscript>` block unhides everything when JavaScript is off.

### Named Rules

**The One Easing Rule.** `--ease-brand` is the only easing curve in the system. If something needs to move differently, change the duration, not the curve. (The dot-field ripple's `cubic-bezier(0.22, 1, 0.36, 1)` is the single documented exception, because it is a physical ripple rather than a UI state change.)

**The Reversible Motion Rule.** Every animation ships with both a `prefers-reduced-motion` path and a no-JavaScript path. A reveal that can only be undone by JavaScript is a bug, not an effect.

## Do's and Don'ts

### Do:
- **Do** separate adjacent dark surfaces by exactly one tonal step (#090909 → #111111 → #1b1b1b) and reach for a hairline Rule border before reaching for a shadow.
- **Do** annotate every band with a monospace uppercase eyebrow at 12px / 0.16em in Dim (#999999). It is the system's connective tissue.
- **Do** use the bracket link for every call to action, and let its colour come from `currentColor` so it adapts to whatever surface it lands on.
- **Do** keep display and headline type uppercase at −0.02em tracking with leading at or below 1.05, and body copy sentence case at 1.65.
- **Do** give every animation both a `prefers-reduced-motion` path and a no-JavaScript path before shipping it.
- **Do** carry an inline `var()` fallback on every font-stack entry — a single undefined custom property invalidates the whole declaration.
- **Do** build cell dividers with `gap: 1px` over a Rule-tinted background rather than per-cell borders.
- **Do** hold the 24px gutter constant at every breakpoint and let the measure, columns and band height carry the responsive change.

### Don't:
- **Don't** introduce a fourth accent hue. Ember and Steel are the chromatic vocabulary; Signal Blue belongs to text selection alone.
- **Don't** spend Ember more than three times on a page, and never on a small decorative element.
- **Don't** round an internal seam or put a gap between two full-bleed bands — the butt joints are the composition.
- **Don't** add a shadow to a resting surface. Shadows answer to hover, focus and overlay only.
- **Don't** introduce a third typeface, or set body paragraphs in the monospace outside the hero standfirst and footer blurb.
- **Don't** use photography or stock illustration. Imagery in this system is SVG point-field artwork.
- **Don't** crossfade the header wordmark into the logo mark — slide the stacked pair.
- **Don't** underline navigation or footer links; state changes are colour and opacity.
- **Don't** introduce a second easing curve for a UI state change; adjust duration instead.
- **Don't** ship invented proof — client logos, testimonials, named case studies or benchmarks. Where evidence is absent, weight comes from craft and specificity.
