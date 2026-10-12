# Micro-interaction specification

> Applies the *Interaction Design & Prototyping* skill (Test 2: micro-interaction
> specification with duration, easing and choreography) to the Absolute template.
> All values use the motion tokens declared in `css/template.css` `:root`
> (`--aas-dur-*`, `--aas-ease-*`) so motion stays consistent site-wide.

## Motion tokens

| Token | Value | Use |
|---|---|---|
| `--aas-dur-instant` | 90ms | press feedback, active states |
| `--aas-dur-fast` | 160ms | hover colour shifts, chevron nudges |
| `--aas-dur-base` | 240ms | default transitions, menu items |
| `--aas-dur-slow` | 420ms | panel/dropdown reveals, accordion |
| `--aas-dur-deliberate` | 8s | ambient motion (Ken Burns) |
| `--aas-ease-standard` | `cubic-bezier(.2, 0, .2, 1)` | general |
| `--aas-ease-decelerate` | `cubic-bezier(.16, 1, .3, 1)` | entrances |
| `--aas-ease-accelerate` | `cubic-bezier(.4, 0, 1, 1)` | exits |
| `--aas-ease-spring` | `cubic-bezier(.34, 1.56, .64, 1)` | playful accents |

## Interaction catalogue

### 1. Top-level nav link hover
- **What:** underline grows from the centre of the label; label shifts to `--aas-primary`.
- **Duration/easing:** underline `240ms` `--aas-ease-decelerate`; colour `160ms` `--aas-ease-standard`.
- **Choreography:** underline originates from 0 width at centre, scales to 100%.
- **State:** also triggered by keyboard focus (`:focus-visible`) and persisted for the active page item (`.is-active`).

### 2. Dropdown open (desktop)
- **What:** panel fades in, lifts 6px → 0 and micro-scales 0.97 → 1; chevron rotates 180°.
- **Duration/easing:** `420ms` `--aas-ease-decelerate` on opacity + transform.
- **Choreography:** chevron (`240ms`) rotates first, then the panel reveals; individual items cascade in staggered by 40ms each.
- **Trigger:** `:hover` or `:focus-within` (keyboard-safe). Closes on pointer leave; `Esc` blurs focus to close.

### 3. Dropdown item hover
- **What:** item background tints 8% brand colour, text turns primary, label nudges right 0.35rem.
- **Duration/easing:** `160ms` — the text nudge is a delight affordance, kept faster than hover colour.

### 4. Second-level flyout
- **What:** nested panel flies out to the right of its parent (translate 6px → 0, scale 0.97 → 1); chevron stays pointing right and nudges 2px on hover.
- **Duration/easing:** same 420ms decelerate entrance as level one.

### 5. Mobile accordion branch
- **What:** branch collapses/expands via `max-height`; chevron (toggle icon) rotates 180°.
- **Duration/easing:** `420ms` `--aas-ease-decelerate` for max-height; chevron `240ms`.
- **Progressive enhancement:** without JS every branch stays expanded (`js-ready` class enables collapsing).

### 6. Safari card hover
- **What:** card lifts 4px with shadow `--aas-shadow-md`; photo zooms 1.06 over 420ms decelerate; a bottom gradient overlay fades in over 240ms.
- **Duration/easing:** lift `240ms` standard; photo zoom `420ms` decelerate (feels cinematic, matches hero cadence).

### 7. Hero carousel (module `mod_aas_hero`)
- **What:** crossfade 900ms; Ken Burns zoom `--aas-dur-deliberate` (8s, scale 1.02 → 1.12 + 1.2% pan); staggered captions 0.25s→0.70s.
- **Behaviour:** pauses on hover/focus/hidden-tab; swipe; keyboard arrows; reduced-motion disables zoom/pan.

### 8. Buttons
- **What:** subtle lift -1px on hover, colour shift 160ms; active returns to 0. Focus ring uses `--aas-secondary` (3px outline, 2px offset).

## Motion principles

1. **One dominant motion at a time** — the image moves OR the text cascades, never both competing for the same 240ms.
2. **All motion is interruptible** — transitions, not animations where possible.
3. **Reduced motion respected** — a global `prefers-reduced-motion` guard collapses every duration to ~0ms (see end of `css/template.css`).
4. **Ambient motion is slow** (≥8s) and attached to the active frame only; nothing drifts in the background.
5. **Everything is keyboard-reachable** — `:focus-within` drives the same states as hover; `Esc` closes overlays.