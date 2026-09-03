'use client'

import { ArrowUp, Sparkles, Square } from 'lucide-react'
import React, { useEffect, useRef } from 'react'

export interface ChatInputProps {
  input: string
  isStreaming: boolean
  disabled?: boolean
  onInputChange: (value: string) => void
  onSubmit: () => void
  onStop: () => void
  onSelectChip?: (prompt: string) => void
}

const STARTER_CHIPS = [
  '🍗 Quick 25-min chicken dinner',
  '🥛 What can I substitute for buttermilk?',
  '🥑 Easy keto lunch ideas with avocado',
  '🍝 What wine pairs with creamy pasta?',
]

/**
 * Mobile-friendly ChatInput with dual Send/Stop button states
 * and quick-starter culinary prompt chips.
 */
export const ChatInput: React.FC<ChatInputProps> = ({
  input,
  isStreaming,
  disabled = false,
  onInputChange,
  onSubmit,
  onStop,
  onSelectChip,
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Auto-resize textarea height up to 140px
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = `${Math.min(
        textareaRef.current.scrollHeight,
        140
      )}px`
    }
  }, [input])

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      if (!isStreaming && input.trim()) {
        onSubmit()
      }
    }
  }

  return (
    <div className="w-full bg-white/95 backdrop-blur-md border-t border-gray-100 p-3 sm:p-4">
      <div className="mx-auto max-w-3xl">
        {/* Starter Suggestion Chips */}
        {!isStreaming && input.length === 0 && (
          <div className="mb-3 flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
            <span className="flex items-center gap-1 text-[11px] font-bold text-gray-400 shrink-0 uppercase tracking-wider pr-1">
              <Sparkles className="h-3 w-3 text-amber-500" />
              Try:
            </span>
            {STARTER_CHIPS.map((chip, index) => (
              <button
                key={index}
                type="button"
                onClick={() => onSelectChip?.(chip.replace(/^[^\s]+\s/, ''))}
                className="rounded-full border border-amber-200 bg-amber-50/50 px-3 py-1 text-xs font-medium text-amber-900 whitespace-nowrap hover:bg-amber-100 transition active:scale-95 shrink-0"
              >
                {chip}
              </button>
            ))}
          </div>
        )}

        {/* Input Form Box */}
        <form
          onSubmit={(e) => {
            e.preventDefault()
            if (isStreaming) {
              onStop()
            } else if (input.trim()) {
              onSubmit()
            }
          }}
          className="relative flex items-end gap-2 rounded-2xl border border-gray-200 bg-gray-50/70 p-1.5 transition-all focus-within:border-amber-500 focus-within:bg-white focus-within:ring-3 focus-within:ring-amber-500/15"
        >
          <textarea
            ref={textareaRef}
            rows={1}
            value={input}
            disabled={disabled}
            onChange={(e) => onInputChange(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask ChefCraft for recipes, substitutions, or cooking tips..."
            className="flex-1 max-h-36 resize-none bg-transparent px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:outline-none disabled:opacity-50"
          />

          {/* Action Button: Dual-State Send or Stop */}
          {isStreaming ? (
            <button
              type="button"
              onClick={onStop}
              aria-label="Stop generation"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-rose-500 text-white shadow-xs hover:bg-rose-600 transition active:scale-90"
              title="Stop generating"
            >
              <Square className="h-4 w-4 fill-white" />
            </button>
          ) : (
            <button
              type="submit"
              disabled={disabled || !input.trim()}
              aria-label="Send message"
              className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl transition active:scale-90 ${
                input.trim() && !disabled
                  ? 'bg-amber-600 text-white shadow-md shadow-amber-600/20 hover:bg-amber-700'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              <ArrowUp className="h-4.5 w-4.5" />
            </button>
          )}
        </form>

        <p className="mt-1.5 text-center text-[11px] text-gray-400">
          ChefCraft AI streams responses token by token • Press Enter to send, Shift+Enter for new line
        </p>
      </div>
    </div>
  )
}

export default ChatInput
