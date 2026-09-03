'use client'

import { ChefHat, User } from 'lucide-react'
import React from 'react'
import { sanitizeStreamingMarkdown } from '../../lib/ai/markdownStream'

export interface ChatMessageProps {
  role: 'user' | 'assistant'
  content: string
  isStreaming?: boolean
}

/**
 * ChatMessage renders distinct visual treatments for user and assistant bubbles.
 * Uses sanitizeStreamingMarkdown to prevent mid-stream layout breakage,
 * and renders a pulsing cursor when actively streaming tokens.
 */
export const ChatMessage: React.FC<ChatMessageProps> = ({
  role,
  content,
  isStreaming = false,
}) => {
  const isUser = role === 'user'
  const displayContent = isStreaming ? sanitizeStreamingMarkdown(content) : content

  return (
    <div
      className={`flex w-full gap-3 py-2 ${
        isUser ? 'justify-end' : 'justify-start'
      } animate-in fade-in duration-200`}
    >
      {/* Assistant Avatar */}
      {!isUser && (
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 text-white shadow-xs">
          <ChefHat className="h-4.5 w-4.5" />
        </div>
      )}

      {/* Message Bubble */}
      <div
        className={`relative max-w-[85%] sm:max-w-[75%] rounded-2xl p-4 text-sm leading-relaxed transition-all ${
          isUser
            ? 'bg-amber-600 text-white shadow-xs rounded-br-xs font-medium'
            : 'border border-gray-100 bg-white text-gray-900 shadow-xs rounded-bl-xs'
        }`}
      >
        <div className="space-y-2 whitespace-pre-wrap break-words">
          {displayContent}

          {/* Streaming blinking cursor */}
          {isStreaming && (
            <span className="inline-block h-4 w-1.5 ml-1 bg-amber-500 animate-pulse align-middle" />
          )}
        </div>
      </div>

      {/* User Avatar */}
      {isUser && (
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gray-900 text-white shadow-xs">
          <User className="h-4.5 w-4.5" />
        </div>
      )}
    </div>
  )
}

export default ChatMessage
