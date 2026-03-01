# Dark Mode Glass Effect Refinement Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Replace harsh white inner-glows on cards in dark mode with an elegant cold-blue light effect, and add a subtle deep-ocean background gradient to dark mode.

**Architecture:** All changes are CSS-only inside `src/app/globals.css`. We add dark-mode overrides for `.motion-card`, `.motion-card::before`, `.surface-card`, and `html.dark body`. No component files are touched.

**Tech Stack:** Tailwind CSS v4, CSS custom properties, `backdrop-filter`

---

### Task 1: Add dark mode body background gradient

**Files:**
- Modify: `src/app/globals.css` — inside `.dark {}` block (currently ends around line 167)

**Step 1: Identify insertion point**

The `.dark` block ends at line 167. We'll add a `html.dark body` rule after the existing `.dark` block (after line 167, before the `body {}` rule at line 170).

**Step 2: Add the rule**

Insert after the `.dark { ... }` closing brace:

```css
html.dark body {
  background-image:
    radial-gradient(ellipse 120% 50% at 100% 0%, rgba(37, 99, 235, 0.07), transparent 55%),
    radial-gradient(ellipse 100% 55% at 0% 100%, rgba(99, 102, 241, 0.05), transparent 52%),
    radial-gradient(ellipse 80% 40% at 50% 50%, rgba(14, 30, 60, 0.15), transparent 60%);
  background-attachment: fixed;
  background-size: cover;
}
```

**Step 3: Visual check**

In browser (localhost:3000), switch to dark mode. Background should still look very dark but with barely perceptible depth — not a dramatic change.

**Step 4: Commit**

```bash
git add src/app/globals.css
git commit -m "style: add subtle dark mode body background gradient"
```

---

### Task 2: Override motion-card box-shadow for dark mode

**Files:**
- Modify: `src/app/globals.css` — add `.dark .motion-card` rule after `html.light .motion-card` block (currently around line 358-364)

**Step 1: Locate insertion point**

Find the block:
```css
html.light .motion-card {
  box-shadow: ...
  border-color: ...
}
```
Insert a `.dark .motion-card` override immediately after it.

**Step 2: Add the rule**

```css
.dark .motion-card {
  box-shadow:
    0 8px 32px -12px rgba(2, 8, 30, 0.55),
    0 2px 8px -4px rgba(2, 8, 30, 0.30),
    inset 0 1.5px 0 rgba(150, 200, 255, 0.10),
    inset 0 -1px 0 rgba(20, 40, 100, 0.25),
    inset 1px 0 0 rgba(100, 160, 255, 0.06);
  border-color: rgba(99, 145, 200, 0.18);
}
```

Key changes vs light mode:
- Top inner highlight: `rgba(255,255,255,0.58)` → `rgba(150,200,255,0.10)` (cold blue, much dimmer)
- Bottom inner shadow: darker deep-blue instead of slate
- Left inner edge: cold blue tint
- Outer shadow: deep navy-black instead of neutral slate

**Step 3: Visual check**

Switch to dark mode. Cards should have a very subtle blue top-edge shimmer instead of a bright white glow.

**Step 4: Commit**

```bash
git add src/app/globals.css
git commit -m "style: replace white inner-glow with cold-blue highlight on dark mode cards"
```

---

### Task 3: Override motion-card::before pseudo-element for dark mode

**Files:**
- Modify: `src/app/globals.css` — add `.dark .motion-card::before` and `.dark .motion-card:hover::before` after the existing `motion-card::before` blocks (currently around line 366-380)

**Step 1: Locate insertion point**

Find:
```css
.motion-card:hover::before {
  opacity: 0.85;
}
```
Insert after this block.

**Step 2: Add the rules**

```css
.dark .motion-card::before {
  background:
    radial-gradient(130% 80% at 0% 0%, rgba(100, 160, 255, 0.06), transparent 55%),
    linear-gradient(135deg, rgba(80, 130, 220, 0.05) 0%, transparent 60%);
  opacity: 0.5;
}

.dark .motion-card:hover::before {
  opacity: 0.75;
}
```

Key changes:
- White radial gradient → cold blue `rgba(100,160,255,0.06)` (much lower alpha)
- White linear gradient → subtle cold blue `rgba(80,130,220,0.05)`
- Base opacity: `0.6` → `0.5`; hover: `0.85` → `0.75`

**Step 3: Visual check**

Cards in dark mode should no longer have a "spotlight" top-left white patch. Should feel like a faint blue-tinted glass sheen.

**Step 4: Commit**

```bash
git add src/app/globals.css
git commit -m "style: replace white card reflection with cold-blue tint in dark mode"
```

---

### Task 4: Add dark mode surface-card override

**Files:**
- Modify: `src/app/globals.css` — add `.dark .surface-card` after `html.light .surface-card:hover` block (currently around line 351-356)

**Step 1: Locate insertion point**

Find:
```css
html.light .surface-card:hover {
  box-shadow: ...
}
```
Insert a `.dark .surface-card` block immediately after.

**Step 2: Add the rule**

```css
.dark .surface-card {
  background:
    radial-gradient(150% 100% at 0% 0%, rgba(80, 130, 220, 0.07), transparent 52%),
    radial-gradient(110% 80% at 100% 100%, rgba(60, 100, 200, 0.04), transparent 56%),
    linear-gradient(155deg, rgba(15, 25, 50, 0.85), rgba(10, 18, 38, 0.75));
  backdrop-filter: blur(22px) saturate(140%) brightness(0.95);
  -webkit-backdrop-filter: blur(22px) saturate(140%) brightness(0.95);
  border-color: rgba(99, 145, 200, 0.16);
  box-shadow:
    0 8px 32px -12px rgba(2, 8, 30, 0.55),
    0 2px 8px -4px rgba(2, 8, 30, 0.25),
    inset 0 1.5px 0 rgba(140, 190, 255, 0.08),
    inset 0 -1px 0 rgba(20, 40, 100, 0.20),
    inset 1px 0 0 rgba(100, 160, 255, 0.05);
}
```

**Step 3: Visual check**

The About card and Education/Experience item cards should have a cool dark glass background with a faint blue shimmer at the top edge.

**Step 4: Commit**

```bash
git add src/app/globals.css
git commit -m "style: add dark mode surface-card with cold-blue glass aesthetic"
```

---

### Task 5: Add dark mode navigation bar styling

**Files:**
- Modify: `src/app/globals.css` — add `.dark nav[class*="fixed"]` after `html.light nav[class*="fixed"]` block (currently around line 382-389)

**Step 1: Locate insertion point**

Find:
```css
html.light nav[class*="fixed"] {
  background: ...
  border-bottom-color: ...
}
```
Insert `.dark nav[class*="fixed"]` immediately after.

**Step 2: Add the rule**

```css
.dark nav[class*="fixed"] {
  background: linear-gradient(
    180deg,
    rgba(11, 18, 36, 0.92) 0%,
    rgba(8, 14, 30, 0.85) 100%
  );
  border-bottom-color: rgba(99, 120, 180, 0.20);
}
```

**Step 3: Visual check**

Navigation bar in dark mode should look like a deep dark panel with a subtle blue-tinted bottom border, instead of using the generic backdrop-blur only.

**Step 4: Commit**

```bash
git add src/app/globals.css
git commit -m "style: add dark mode navigation bar glass styling"
```

---

### Task 6: Final visual review across both modes

**Step 1: Check light mode is unchanged**

Toggle to light mode. Verify all cards, nav, and background look identical to before.

**Step 2: Check dark mode improvements**

Toggle to dark mode. Verify:
- [ ] Cards have cold-blue top shimmer (not white glare)
- [ ] Card top-left corner has no white spotlight
- [ ] Background has subtle depth (barely perceptible dark gradient)
- [ ] Navigation bar is dark with blue-tinted border
- [ ] Overall feel: "premium cold glass" not "bright white neon"

**Step 3: Take full-page screenshots of both modes for comparison**

**Step 4: Final commit if any tweaks were needed**
