/**
 * Streaming-Aware Markdown Sanitizer
 *
 * During active token streaming, incomplete Markdown constructs
 * (such as unclosed code fences, dangling bold asterisks, or unclosed backticks)
 * cause severe visual flickering and layout breakdown in naive renderers.
 *
 * This utility buffers and completes dangling Markdown tokens so that
 * intermediate streaming frames render cleanly and predictably.
 */

export function sanitizeStreamingMarkdown(rawText: string): string {
  if (!rawText) return ''

  let text = rawText

  // 1. Check for unclosed code fences (```)
  const codeBlockMatches = text.match(/```/g) || []
  const hasUnclosedCodeBlock = codeBlockMatches.length % 2 !== 0

  if (hasUnclosedCodeBlock) {
    text += '\n```'
  } else {
    // 2. Check for unclosed inline code (`) only if not inside a code block
    // Strip completed code blocks first to check inline backticks
    const textWithoutBlocks = text.replace(/```[\s\S]*?```/g, '')
    const inlineCodeMatches = textWithoutBlocks.match(/`/g) || []
    if (inlineCodeMatches.length % 2 !== 0) {
      text += '`'
    }
  }

  // 3. Check for unclosed bold (** or __)
  const boldMatches = text.match(/\*\*/g) || []
  if (boldMatches.length % 2 !== 0) {
    text += '**'
  }

  return text
}
