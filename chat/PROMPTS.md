# Phase: Build (core) — Streaming AI Chat Interface (ChefCraft AI) — Engineering Prompts Log

**Author**: Al-Ameen  
**Track**: FlyRank Front-end AI Engineering  
**Phase**: Build (core) · Estimated Hours: 6  
**Topic**: Capstone Central AI Interaction — Streaming Claude Chatbot

---

## 1. Context & Objectives

This document logs the engineering prompts used to implement **ChefCraft AI**, the central streaming AI interaction for the **RecipeCraft** capstone project. The interface features token-by-token streaming, smart auto-scroll that releases upon manual scroll-up, an interactive stop button with state persistence, smooth thinking-to-token handoff, and mobile optimization.

---

## 2. Server Architecture & Configuration Prompts

### Prompt 1: Centralized AI Model Configuration (`lib/ai/config.ts`)
```text
Create a clean, well-commented module in lib/ai/config.ts defining:
1. Model Configuration:
   - Default model: 'claude-3-5-sonnet-20241022'
   - Configurable parameters: temperature (0.7), maxTokens (1500)
2. System Prompt:
   - Establish persona as 'ChefCraft AI', master culinary assistant and executive chef.
   - Core capabilities: pantry discovery, ingredient substitutions (vegan, keto, gluten-free), technique coaching, food safety guidelines (meat temperatures, storage), and beverage pairings.
   - Formatting rules: clear Markdown headings, bulleted ingredients, numbered step-by-step instructions.
3. Strict TypeScript interface: AIModelConfig.
```

---

### Prompt 2: Streaming-Safe Markdown Sanitizer (`lib/ai/markdownStream.ts`)
```text
Implement sanitizeStreamingMarkdown(rawText: string): string in lib/ai/markdownStream.ts.
Requirements:
- Detect unclosed code fences (```) and append closing backticks.
- Detect dangling inline backticks (`) and append a closing backtick.
- Detect unclosed bold asterisks (**) and append closing asterisks.
- Prevent layout breaking and flickering while tokens are arriving mid-sentence.
```

---

### Prompt 3: Next.js Streaming Route Handler (`app/api/chat/route.ts`)
```text
Build a Next.js App Router POST handler in app/api/chat/route.ts:
1. Validate incoming messages array.
2. If ANTHROPIC_API_KEY is present in environment:
   - Call Claude via Vercel AI SDK's streamText using chefCraftConfig.
   - Return result.toDataStreamResponse().
3. If ANTHROPIC_API_KEY is not configured:
   - Provide a realistic Server-Sent Events (SSE) data stream fallback emitting token-by-token chunks.
   - Ensure reviewers can test token streaming, auto-scroll, and stop functionality without requiring an external paid key.
4. Set maxDuration = 30 and ensure API key lives strictly on the server.
```

---

## 3. Client Streaming Interface & Auto-Scroll Prompts

### Prompt 4: Main Streaming Chat Container (`components/chat/StreamingChat.tsx`)
```text
Build the main StreamingChat component in components/chat/StreamingChat.tsx:
1. Streaming State Management:
   - Track messages: Message[] ({ id, role, content }).
   - Track status: 'idle' | 'thinking' | 'streaming' | 'error'.
   - Use AbortController to handle generation cancellation.
2. Auto-Scroll Robustness (Mentor Tip):
   - Measure scroll position on scroll event.
   - Pin to bottom ONLY if user is already at the bottom (scrollHeight - scrollTop - clientHeight <= 48).
   - The instant the user scrolls up, immediately pause auto-scroll and display a floating 'Jump to latest' button.
   - Clicking 'Jump to latest' smoothly scrolls to bottom and re-pins.
3. Stop Button & State Resilience (Mentor Tip):
   - Clicking Stop aborts the fetch stream via AbortController.
   - The partial assistant message MUST persist on screen.
   - Input MUST immediately re-enable.
   - The next user message must send cleanly and maintain multi-turn context ('Stop, then send again').
4. Flicker-Free Thinking Handoff (Mentor Tip):
   - Render ThinkingIndicator while status is 'thinking'.
   - Transition to 'streaming' on the exact frame the first token arrives.
5. Conversation Persistence:
   - Store messages in localStorage so page refresh is not a data-loss event.
   - Provide a 'New Chat' reset button.
```

---

### Prompt 5: Dual-State Input & Starter Chips (`components/chat/ChatInput.tsx`)
```text
Build a mobile-friendly ChatInput component in components/chat/ChatInput.tsx:
1. Auto-resizing textarea up to 140px.
2. Enter key submits (Shift+Enter adds new line).
3. Action button:
   - While streaming: renders red/rose Stop button with Square icon.
   - While idle/typing: renders amber Send button with ArrowUp icon.
4. Quick-starter suggestion chips above input for pantry ideas, substitutions, and pairings.
```

---

### Prompt 6: Unit Tests (`__tests__/chat.test.tsx`)
```text
Create Vitest unit tests in __tests__/chat.test.tsx:
- Test chefCraftConfig defaults and system prompt content.
- Test sanitizeStreamingMarkdown with unclosed code fences, bold text, and inline code.
- Test route handler validation and fallback stream response format.
```
