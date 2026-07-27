# Workflow Comparison: Vague vs Precise AI Prompting

## Overview
This document compares two approaches to AI-assisted frontend development,
using a settings form with validation as the test case.

## Round One: Vague Prompt

**Prompt used:**
> "Build me a settings form with validation."

**What was built:**
Cursor scaffolded a full Next.js app and produced a settings form with
Zod validation, React Hook Form, accessible labels, aria-invalid attributes,
and a success message. The output was surprisingly complete for a one-sentence
prompt.

**Problems identified:**
- The AI made assumptions about the file structure that didn't match the
  project conventions in CLAUDE.md
- No tests were written — I had to manually verify every behaviour
- The reset button defaulted to clearing fields rather than resetting to
  default values
- No character count on the Bio field
- Email field accepted uppercase characters — no lowercase enforcement
- Review effort was high because I had no spec to check the output against

**Time including review:** Approximately 25 minutes

---

## Round Two: Precise Prompt

**Prompt used:**
A detailed spec including: file references, TypeScript constraints, field-level
validation rules, UX behaviour constraints, accessibility requirements, and a
verification step requiring tests to be written and run before finishing.

**What was built:**
- Zod schema with strict constraints including no special characters on
  display name and lowercase enforcement on email
- Live character counter on Bio field
- aria-invalid and role="alert" on all error messages
- Save disabled until form is both dirty AND valid
- Async submit handler with simulated delay, success and error toasts
- 4 tests written and passing covering all critical behaviours

**AI mistakes I caught:**
Round one produced two specific errors that only became visible during
manual testing:

1. The Bio field had no character count — the AI assumed a max length
   constraint meant validation only, not a live UI counter. A user would
   have no way of knowing they were approaching the 200 character limit
   until hitting the error after blur.

2. The email field accepted uppercase characters like TEST@GMAIL.COM
   without complaint. The AI validated email format but never enforced
   lowercase — meaning two users could register with the same email
   address in different cases, a real data integrity bug in production.

Neither mistake appeared in Round two because both constraints were
explicitly stated in the prompt.

**Time including review:** Approximately 40 minutes total, but zero
fixing time after — the output matched the spec exactly.

---

## Key Differences

| | Round One | Round Two |
|---|---|---|
| Prompt length | 1 sentence | ~30 lines |
| Tests included | No | Yes, 4 passing |
| Review effort | High | Low |
| Fixing time | ~15 minutes | 0 minutes |
| Accessibility | Partial | Full |
| Matched conventions | No | Yes |

## The Lesson

Round two felt slower to start because writing the spec took time.
But the total time end-to-end was faster because there was nothing to fix.
A vague prompt shifts the work from writing to reviewing and debugging.
A precise prompt shifts the work to the front — into thinking — which is
where it belongs.

The AI is not slower when given more context. It is more accurate.
The bottleneck is never the model. It is the clarity of the instruction.

---

## CLAUDE.md Rules Added

1. Forms must use React Hook Form and Zod — never uncontrolled inputs
2. Test files go in `__tests__/` at the project root — never inside component folders
3. Email fields must enforce lowercase via Zod `.toLowerCase()` transform