# Architectural Review & Analysis: Custom Accessible Components vs. shadcn/ui (Radix UI)

**Author**: Al-Ameen  
**Track**: FlyRank Front-end AI Engineering — Foundations: Component Accessibility  
**Scope**: Hand-crafted W3C APG Components (`playground/components/`) vs. `shadcn/ui` Primitives (`components/ui/`)

---

## 1. Overview & Evaluation Goals

In this exercise, we implemented three core interactive widgets completely from scratch in React 19 and TypeScript, strictly adhering to the **W3C ARIA Authoring Practices Guide (APG)**:
1. **Modal Dialog** (`role="dialog"`, focus trap, focus restoration, `Escape` key, backdrop).
2. **Tabs** (`role="tablist"`, roving `tabindex`, `ArrowLeft`/`ArrowRight` wrap-around, `Home`/`End`).
3. **Disclosure** (Native button trigger, `aria-expanded`, `aria-controls`, `role="region"`).

We then installed and analyzed `shadcn/ui`'s implementations (`dialog.tsx` and `tabs.tsx`), which are built on top of **Radix UI Primitives** (`@radix-ui/react-dialog`, `@radix-ui/react-tabs`).

Below is an in-depth technical analysis identifying **five concrete architectural gaps** that production component libraries like `shadcn/ui` handle that our custom implementations initially missed.

---

## 2. Concrete Gaps Identified

### 🚨 Gap 1: Scrollbar Width Layout Shift Compensation (`document.body` Locking)

* **Our Custom Version (`Modal.tsx`)**:
  When the modal opens, we lock the background scroll using:
  ```ts
  document.body.style.overflow = 'hidden'
  ```
* **The Problem**:
  On desktop browsers (Windows Chrome, Edge, Linux, and macOS with always-on scrollbars), removing the scrollbar causes the entire webpage viewport width to instantaneously expand by 15px–17px. This creates a jarring visual jump ("layout thrashing") where headers, buttons, and text visibly shift to the right when opening, and snap back to the left when closing.
* **What shadcn/ui (Radix UI) Handles**:
  Radix's `@radix-ui/react-dialog` calculates the exact layout scrollbar delta:
  ```ts
  const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
  document.body.style.paddingRight = `${scrollbarWidth}px`;
  ```
  It automatically compensates by injecting a matching `padding-right` on `document.body` (or leverages CSS `scrollbar-gutter: stable`). The user gets full scroll locking with **zero layout shifts**.

---

### 🚨 Gap 2: React Portals & Stacking Context Traps (`z-index` & `overflow: hidden`)

* **Our Custom Version (`Modal.tsx`)**:
  Renders the modal inline inside the component's existing DOM hierarchy:
  ```tsx
  <div className="fixed inset-0 z-50 ...">
  ```
* **The Problem**:
  In CSS, if any ancestor of our Modal has `transform`, `filter`, `perspective`, `contain: paint`, or `overflow: hidden`, that ancestor establishes a **new local stacking context and containing block**. 
  Consequently, our `fixed inset-0` modal will be visually trapped and clipped inside the parent container rather than covering the entire screen.
* **What shadcn/ui (Radix UI) Handles**:
  shadcn explicitly wraps content in `<DialogPortal>` (`@radix-ui/react-portal`), which teleports the DOM nodes directly to `document.body`. This guarantees the dialog always breaks free of ancestor clipping and renders at the true root of the document.

---

### 🚨 Gap 3: Complete Assistive Technology Invalidation (`aria-hidden="true"` / `inert` on Siblings)

* **Our Custom Version (`Modal.tsx`)**:
  We implemented an in-memory keyboard focus trap listening for `Tab` and `Shift + Tab` keystrokes.
* **The Problem**:
  Screen readers (VoiceOver, NVDA, JAWS, TalkBack) do **not** navigate solely by pressing the `Tab` key. Screen reader users frequently navigate by:
  1. Virtual cursor reading (arrowing through text, paragraphs, and headings).
  2. Mobile swipe gestures (linear accessibility tree traversal).
  3. Touch-exploration on mobile screens.
  
  Because our background DOM elements remain in the accessibility tree, a screen reader user can easily swipe or arrow out of our open modal into background page content, causing severe disorientation.
* **What shadcn/ui (Radix UI) Handles**:
  Radix uses `@radix-ui/react-aria-hidden` / HTML `inert`. When a dialog opens, Radix traverses the DOM and applies `aria-hidden="true"` to all sibling containers outside the portal. Assistive technologies are physically blocked from discovering or reading background elements until the dialog closes.

---

### 🚨 Gap 4: Pointer Events Origin Tracking & Drag-Selection Dismissal

* **Our Custom Version (`Modal.tsx`)**:
  We added a backdrop click handler:
  ```tsx
  <div className="fixed inset-0 ..." onClick={onClose} />
  ```
* **The Problem**:
  If a user highlights text inside the modal, clicks, and accidentally releases their mouse cursor slightly outside the modal boundaries onto the backdrop, a native `click` event fires on the backdrop. This unexpectedly closes the dialog and wipes out the user's form input!
* **What shadcn/ui (Radix UI) Handles**:
  Radix uses `onPointerDownOutside` and `onInteractOutside`. It tracks the origin of `pointerdown` vs `pointerup`:
  * If a click started inside the modal and ended outside, it will **not** dismiss the dialog.
  * Only an intentional click that begins and finishes outside triggers dismissal.
  * It exposes an event hook allowing developers to call `event.preventDefault()` to conditionally prevent dismissal (e.g. while an unsaved form is dirty).

---

### 🚨 Gap 5: Bi-directional Layouts (RTL) & Multi-Orientation in Tabs

* **Our Custom Version (`Tabs.tsx`)**:
  We hardcoded horizontal keyboard navigation:
  ```ts
  case 'ArrowRight': nextIndex = (activeIndex + 1) % totalTabs;
  case 'ArrowLeft':  nextIndex = (activeIndex - 1 + totalTabs) % totalTabs;
  ```
* **The Problem**:
  In Right-to-Left (RTL) locales (such as Arabic, Hebrew, or Persian), the visual order of items is flipped. Pressing `ArrowRight` should move to the *previous* tab, and `ArrowLeft` should move to the *next* tab. Our code moves in reverse in RTL layouts. Furthermore, vertical tabs require `ArrowUp` / `ArrowDown`.
* **What shadcn/ui (Radix UI) Handles**:
  Radix's `@radix-ui/react-tabs` accepts a `dir="ltr" | "rtl"` prop (or reads the inherited document `dir` attribute) and automatically swaps the arrow keys. It also accepts `orientation="horizontal" | "vertical"` and dynamically binds `ArrowUp`/`ArrowDown` instead.

---

## 3. Comparative Summary Table

| Feature / Criterion | Custom Implementation (`playground/`) | shadcn/ui (Radix UI Primitives) |
| :--- | :--- | :--- |
| **W3C APG ARIA Roles** | ✅ `dialog`, `tablist`, `tab`, `tabpanel`, `region` | ✅ Full compliance |
| **Keyboard Operability** | ✅ Tab, Shift+Tab, Escape, Arrows, Home, End | ✅ Full compliance |
| **Focus Trap & Return** | ✅ ActiveElement ref + Tab boundary loop | ✅ FocusScope primitive with autofocus order |
| **Scrollbar Shift Compensation** | ❌ None (`overflow: hidden` causes shift) | ✅ Measures scrollbar width & pads body |
| **DOM Stacking Isolation** | ❌ Inline `fixed` (vulnerable to parent clipping) | ✅ Teleported to root via `<DialogPortal>` |
| **Screen Reader Background Blocker** | ❌ Keyboard trap only (virtual cursor escapes) | ✅ Recursive `aria-hidden` / `inert` on siblings |
| **Pointer Drag Protection** | ❌ Backdrop click fires on drag release | ✅ `pointerdown` origin detection |
| **RTL & Vertical Tabs** | ❌ Hardcoded LTR horizontal arrows | ✅ Bi-directional RTL switch & vertical orientation |
| **Composition Architecture** | Flat props (`tabs={...}`) | Compound subcomponents (`TabsList`, `TabsTrigger`) |

---

## 4. Key Takeaways for AI-Assisted Frontend Engineering

1. **AI Output Traps**: When asked to generate a "modal", AI models almost universally generate our "custom version"—a `fixed inset-0` div with an `onClick` and maybe an `overflow: hidden`. AI models rarely account for scrollbar layout shift, portal mounting, or sibling `aria-hidden` traversal unless explicitly directed.
2. **When to Build from Scratch vs Use Headless Primitives**:
   * Building from scratch is an essential learning foundation to understand focus trapping, roving tabindex, and ARIA relationships.
   * In production, always prefer headless, unstyled primitives like **Radix UI** or **React Aria**. They contain hundreds of edge-case fixes that took thousands of engineering hours to mature.
