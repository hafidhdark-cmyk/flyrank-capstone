import type { Metadata } from 'next'
import React from 'react'
import StreamingChat from '../../components/chat/StreamingChat'

export const metadata: Metadata = {
  title: 'ChefCraft AI — Streaming Culinary Assistant | RecipeCraft',
  description:
    'Real-time streaming AI cooking assistant powered by Claude. Get instant culinary advice, ingredient substitutions, and meal recommendations.',
}

export default function ChatPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-6 sm:px-6 lg:px-8 h-[calc(100vh-4.5rem)] flex flex-col">
      <StreamingChat />
    </div>
  )
}
