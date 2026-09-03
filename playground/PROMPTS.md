# Foundations: Component Accessibility (W3C ARIA APG) — Engineering Prompts Log

**Author**: Al-Ameen  
**Track**: FlyRank Front-end AI Engineering  
**Phase**: Foundations · Estimated Hours: 5  
**Topic**: Building Accessible Components from Scratch (Modal, Tabs, Disclosure) vs. shadcn/ui (Radix UI)

---

## 1. Context & Objectives

This document logs the step-by-step engineering prompts used to develop three accessible, production-grade interactive components from scratch in React 19 and TypeScript, strictly adhering to the **W3C ARIA Authoring Practices Guide (APG)** patterns without third-party component libraries.

---

## 2. Hand-Crafted Component Prompts

### Prompt 1: W3C APG Modal Dialog Pattern (`playground/components/Modal.tsx`)
```text
Build an accessible Modal Dialog component from scratch in React 19 + TypeScript according to the W3C ARIA Authoring Practices Guide (APG).

Requirements:
1. ARIA Roles & Attributes:
   - role="dialog"
   - aria-modal="true"
   - aria-labelledby pointing to the title element id
   - aria-describedby pointing to the description element id (if provided)
2. Keyboard Interaction:
   - Escape key immediately dismisses the modal.
   - Tab and Shift + Tab focus trap: focus must cycle strictly within the modal's focusable elements and never escape to background content.
3. Focus Management:
   - Save the triggering element (document.activeElement) upon opening.
   - Automatically move focus into the first focusable element (or dialog container) when opened.
   - Restore focus to the saved trigger element when closed.
4. Background & Scroll:
   - Lock body scrolling (overflow: hidden) while the modal is active.
   - Backdrop overlay click to dismiss.
5. Strict TypeScript:
   - Component props interface: isOpen, onClose, title, description, children.
   - Zero 'any' type escapes.
```

---

### Prompt 2: W3C APG Tabs Pattern (`playground/components/Tabs.tsx`)
```text
Build an accessible Tabs component from scratch in React 19 + TypeScript according to the W3C ARIA APG Tabs pattern.

Requirements:
1. ARIA Roles & Attributes:
   - Outer container: role="tablist" with aria-label
   - Tab buttons: role="tab", aria-selected, aria-controls="panel-{id}", and roving tabindex
   - Tab panels: role="tabpanel", aria-labelledby="tab-{id}", tabindex="0", hidden when inactive
2. Keyboard Navigation:
   - Roving tabindex: active tab has tabindex="0"; all inactive tabs have tabindex="-1".
   - ArrowRight and ArrowLeft: navigate between tabs with circular wrap-around.
   - Home key: jumps focus directly to the first tab.
   - End key: jumps focus directly to the last tab.
   - Tab key: moves focus out of the tablist directly into the active tab panel.
3. Strict TypeScript:
   - Zero 'any' type escapes. Fully typed TabItem and TabsProps interfaces.
```

---

### Prompt 3: W3C APG Disclosure Pattern (`playground/components/Disclosure.tsx`)
```text
Build an accessible Disclosure (Accordion/Collapsible) component from scratch in React 19 + TypeScript according to the W3C ARIA APG Disclosure pattern.

Requirements:
1. ARIA Roles & Attributes:
   - Trigger element must be a native <button> with aria-expanded (boolean) and aria-controls="panel-{id}".
   - Collapsible panel has id="panel-{id}", role="region", and aria-labelledby matching the trigger id.
2. Keyboard Interaction:
   - Enter and Space keys toggle the expanded/collapsed state (handled natively by button).
   - Tab key moves focus into the expanded panel content.
3. Strict TypeScript:
   - Component props interface: title, defaultOpen, children, badge.
   - Zero 'any' type escapes.
```

---

## 3. Playground & Testing Prompts

### Prompt 4: Interactive Showcase (`playground/components/PlaygroundView.tsx` & `app/playground/page.tsx`)
```text
1. Create an interactive testing arena in playground/components/PlaygroundView.tsx showcasing all three components with explicit, step-by-step keyboard testing instructions for reviewers.
2. Expose the showcase under the Next.js App Router at app/playground/page.tsx (live at http://localhost:3000/playground).
3. Add a navigation link to 'A11y Playground' inside components/recipecraft/Header.tsx.
```

---

### Prompt 5: Automated Vitest Test Suite (`__tests__/playground.test.tsx`)
```text
Write a comprehensive unit test suite in __tests__/playground.test.tsx using Vitest and React Testing Library:
1. Modal Component:
   - Test rendering with role="dialog", aria-modal="true", and aria-labelledby.
   - Test non-rendering when isOpen=false.
   - Test Escape key dismissal.
   - Test Tab / Shift+Tab focus trap wrap-around.
2. Tabs Component:
   - Test role="tablist", role="tab", and roving tabindex (active=0, inactive=-1).
   - Test ArrowRight / ArrowLeft navigation and circular wrap-around.
   - Test Home and End jump keys.
3. Disclosure Component:
   - Test aria-expanded toggle and region visibility.
- Ensure all tests pass without flakiness across both real browser and JSDOM environments.
```

---

## 4. shadcn/ui Comparison & Analysis Prompt

### Prompt 6: shadcn/ui Source Inspection & Architectural Report (`playground/NOTES.md`)
```text
1. Install shadcn/ui primitives (@radix-ui/react-dialog, @radix-ui/react-tabs) and create components/ui/dialog.tsx and components/ui/tabs.tsx.
2. Read the generated source code and underlying Radix UI primitives.
3. Write an in-depth architectural comparison in playground/NOTES.md identifying at least two concrete gaps between our hand-crafted components and shadcn's production implementation.
4. Detail:
   - Scrollbar width layout shift compensation (padding-right injection).
   - React Portals and CSS stacking context traps (overflow: hidden clipping).
   - Complete screen reader background invalidation (aria-hidden/inert on siblings).
   - Pointer down/up origin tracking for click dismissals.
   - RTL bi-directional keyboard navigation and vertical tab support.
```
