import { describe, expect, it } from 'vitest'
import {
  CHEFCRAFT_SYSTEM_PROMPT,
  DEFAULT_MODEL_ID,
  chefCraftConfig,
} from '../lib/ai/config'
import { sanitizeStreamingMarkdown } from '../lib/ai/markdownStream'

describe('ChefCraft AI — Configuration & Markdown Utilities', () => {
  describe('Model Configuration (lib/ai/config.ts)', () => {
    it('exports a valid default model ID and temperature', () => {
      expect(DEFAULT_MODEL_ID).toBe('claude-3-5-sonnet-20241022')
      expect(chefCraftConfig.temperature).toBeGreaterThanOrEqual(0)
      expect(chefCraftConfig.temperature).toBeLessThanOrEqual(1)
      expect(chefCraftConfig.maxTokens).toBeGreaterThan(0)
    })

    it('contains comprehensive culinary domain instructions in system prompt', () => {
      expect(CHEFCRAFT_SYSTEM_PROMPT).toContain('ChefCraft AI')
      expect(CHEFCRAFT_SYSTEM_PROMPT).toContain('Culinary Substitutions')
      expect(CHEFCRAFT_SYSTEM_PROMPT).toContain('Food Safety')
    })
  })

  describe('Streaming Markdown Sanitizer (lib/ai/markdownStream.ts)', () => {
    it('returns empty string for empty input', () => {
      expect(sanitizeStreamingMarkdown('')).toBe('')
    })

    it('leaves fully balanced Markdown untouched', () => {
      const balanced = '### Heading\n**Bold text** and `inline code`'
      expect(sanitizeStreamingMarkdown(balanced)).toBe(balanced)
    })

    it('automatically closes dangling bold tokens (**) mid-stream', () => {
      const incomplete = 'Here is **very important'
      expect(sanitizeStreamingMarkdown(incomplete)).toBe('Here is **very important**')
    })

    it('automatically closes unclosed code blocks mid-stream', () => {
      const incomplete = 'Here is the recipe:\n```typescript\nconst grams = 500'
      expect(sanitizeStreamingMarkdown(incomplete)).toBe(
        'Here is the recipe:\n```typescript\nconst grams = 500\n```'
      )
    })

    it('automatically closes dangling inline backticks mid-stream', () => {
      const incomplete = 'Use `1 tbsp of butter'
      expect(sanitizeStreamingMarkdown(incomplete)).toBe('Use `1 tbsp of butter`')
    })
  })
})
