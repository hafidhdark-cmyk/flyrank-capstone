'use client'

import { RotateCcw } from 'lucide-react'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import ChatInput from './ChatInput'
import ChatMessage from './ChatMessage'
import ScrollToBottom from './ScrollToBottom'
import ThinkingIndicator from './ThinkingIndicator'

export interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
}

const STORAGE_KEY = 'recipecraft_chat_messages_v1'

const INITIAL_WELCOME_MESSAGE: Message = {
  id: 'welcome-msg',
  role: 'assistant',
  content: `### 🧑‍🍳 Welcome to ChefCraft AI!

I am your personal streaming culinary assistant. Tell me what ingredients you have in your fridge, ask for cooking advice, or request meal ideas:

* *"What can I make with chicken breasts, garlic, and spinach?"*
* *"How do I substitute buttermilk in pancakes?"*
* *"Give me a 20-minute vegetarian pasta recipe."*

How can I help your kitchen today?`,
}

export const StreamingChat: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([INITIAL_WELCOME_MESSAGE])
  const [input, setInput] = useState('')
  const [status, setStatus] = useState<'idle' | 'thinking' | 'streaming' | 'error'>('idle')
  const [showScrollBottom, setShowScrollBottom] = useState(false)

  const messagesContainerRef = useRef<HTMLDivElement>(null)
  const abortControllerRef = useRef<AbortController | null>(null)
  const isAtBottomRef = useRef(true)

  // 1. Restore conversation from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) {
        const parsed = JSON.parse(saved)
        if (Array.isArray(parsed) && parsed.length > 0) {
          setMessages(parsed)
        }
      }
    } catch {
      // Graceful localStorage fallback
    }
  }, [])

  // 2. Persist conversation across turns so refresh isn't a data-loss event
  useEffect(() => {
    if (messages.length > 1) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(messages))
      } catch {
        // Storage limit protection
      }
    }
  }, [messages])

  // 3. Robust Auto-Scroll Manager
  // Pins to bottom ONLY while user is already at bottom.
  // Releases the pin the instant user scrolls up.
  const checkScrollPosition = useCallback(() => {
    const el = messagesContainerRef.current
    if (!el) return

    const threshold = 48
    const atBottom = el.scrollHeight - el.scrollTop - el.clientHeight <= threshold
    isAtBottomRef.current = atBottom
    setShowScrollBottom(!atBottom)
  }, [])

  const scrollToBottom = useCallback((smooth = true) => {
    const el = messagesContainerRef.current
    if (!el) return

    el.scrollTo({
      top: el.scrollHeight,
      behavior: smooth ? 'smooth' : 'auto',
    })
    isAtBottomRef.current = true
    setShowScrollBottom(false)
  }, [])

  // Auto-scroll when new tokens arrive, ONLY IF user is currently pinned at bottom
  useEffect(() => {
    if (isAtBottomRef.current) {
      scrollToBottom(false)
    }
  }, [messages, status, scrollToBottom])

  // 4. Send Message & Stream Tokens via SSE
  const handleSend = async (userPrompt?: string) => {
    const textToSend = userPrompt || input
    if (!textToSend.trim() || status === 'streaming') return

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: textToSend.trim(),
    }

    const updatedMessages = [...messages, userMessage]
    setMessages(updatedMessages)
    setInput('')
    setStatus('thinking')

    // Always re-pin on sending new question
    isAtBottomRef.current = true
    setShowScrollBottom(false)
    scrollToBottom(true)

    // Abort previous stream if active
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }
    const controller = new AbortController()
    abortControllerRef.current = controller

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: updatedMessages.map(({ role, content }) => ({ role, content })),
        }),
        signal: controller.signal,
      })

      if (!response.ok || !response.body) {
        throw new Error(`Server returned status ${response.status}`)
      }

      const reader = response.body.getReader()
      const decoder = new TextDecoder()
      let assistantText = ''
      const assistantId = `assistant-${Date.now()}`
      let isFirstChunk = true

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        const rawChunk = decoder.decode(value, { stream: true })

        // Parse AI SDK data stream lines: 0:"token text"
        const lines = rawChunk.split('\n')
        for (const line of lines) {
          if (line.startsWith('0:')) {
            try {
              const textContent = JSON.parse(line.slice(2))
              assistantText += textContent
            } catch {
              // Raw text chunk fallback
              assistantText += line.slice(2)
            }
          } else if (!line.startsWith('d:') && line.trim()) {
            // Standard raw SSE stream chunk fallback
            assistantText += line
          }
        }

        // Seamless Thinking-to-Token Handoff:
        // Transition from 'thinking' to 'streaming' on the exact frame the first token arrives
        if (isFirstChunk && assistantText.length > 0) {
          setStatus('streaming')
          isFirstChunk = false
        }

        // Update assistant message with streaming content
        setMessages((prev) => {
          const last = prev[prev.length - 1]
          if (last && last.id === assistantId) {
            return prev.map((m) => (m.id === assistantId ? { ...m, content: assistantText } : m))
          }
          return [...prev, { id: assistantId, role: 'assistant', content: assistantText }]
        })
      }

      setStatus('idle')
    } catch (err: unknown) {
      if (err instanceof Error && err.name === 'AbortError') {
        // Graceful user cancellation: keep partial message, re-enable input
        setStatus('idle')
      } else {
        setStatus('error')
        setMessages((prev) => [
          ...prev,
          {
            id: `err-${Date.now()}`,
            role: 'assistant',
            content: '⚠️ Unable to complete response stream. Please try again.',
          },
        ])
      }
    } finally {
      abortControllerRef.current = null
    }
  }

  // 5. Stop Button Handler: Halts stream, preserves partial text, re-enables input
  const handleStop = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
      abortControllerRef.current = null
      setStatus('idle')
    }
  }

  // Clear conversation history
  const handleReset = () => {
    if (status === 'streaming') {
      handleStop()
    }
    setMessages([INITIAL_WELCOME_MESSAGE])
    localStorage.removeItem(STORAGE_KEY)
  }

  return (
    <div className="relative flex h-full min-h-[580px] flex-col rounded-3xl border border-gray-100 bg-gray-50/40 shadow-xl shadow-amber-500/5 overflow-hidden">
      {/* Chat Header */}
      <div className="flex items-center justify-between border-b border-gray-100 bg-white px-5 py-3.5 shadow-2xs">
        <div className="flex items-center gap-2.5">
          <div className="relative flex h-3 w-3">
            <span
              className={`absolute inline-flex h-full w-full rounded-full opacity-75 animate-ping ${
                status === 'streaming' ? 'bg-amber-400' : 'bg-emerald-400'
              }`}
            />
            <span
              className={`relative inline-flex h-3 w-3 rounded-full ${
                status === 'streaming' ? 'bg-amber-500' : 'bg-emerald-500'
              }`}
            />
          </div>
          <div>
            <h2 className="text-sm font-bold text-gray-900 flex items-center gap-1.5">
              ChefCraft AI <span className="rounded-md bg-amber-100 px-1.5 py-0.5 text-[10px] font-semibold text-amber-800">Claude Streaming</span>
            </h2>
            <p className="text-[11px] text-gray-400">
              {status === 'streaming'
                ? 'Streaming response...'
                : status === 'thinking'
                ? 'Thinking...'
                : 'Ready in kitchen'}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleReset}
          className="inline-flex items-center gap-1 rounded-xl border border-gray-200 px-2.5 py-1 text-xs font-semibold text-gray-600 hover:bg-gray-50 transition"
          title="Clear chat history"
        >
          <RotateCcw className="h-3 w-3" />
          <span>New Chat</span>
        </button>
      </div>

      {/* Messages Scroll Area */}
      <div
        ref={messagesContainerRef}
        onScroll={checkScrollPosition}
        className="relative flex-1 overflow-y-auto p-4 sm:p-6 space-y-3"
      >
        {messages.map((message, index) => {
          const isLatestStreaming =
            status === 'streaming' &&
            message.role === 'assistant' &&
            index === messages.length - 1

          return (
            <ChatMessage
              key={message.id}
              role={message.role}
              content={message.content}
              isStreaming={isLatestStreaming}
            />
          )
        })}

        {/* Thinking Indicator before the first token arrives */}
        <ThinkingIndicator visible={status === 'thinking'} />

        {/* Floating Jump to Latest Button */}
        <ScrollToBottom
          visible={showScrollBottom}
          onClick={() => scrollToBottom(true)}
        />
      </div>

      {/* Input Form with Send / Stop Actions */}
      <ChatInput
        input={input}
        isStreaming={status === 'streaming'}
        disabled={status === 'thinking'}
        onInputChange={setInput}
        onSubmit={() => handleSend()}
        onStop={handleStop}
        onSelectChip={(chip) => handleSend(chip)}
      />
    </div>
  )
}

export default StreamingChat
