import type { Metadata } from 'next'
import PlaygroundView from '../../playground/components/PlaygroundView'

export const metadata: Metadata = {
  title: 'Accessibility Playground — Foundations W3C APG',
  description:
    'Hand-crafted accessible Modal, Tabs, and Disclosure components built from scratch in React + TypeScript according to W3C ARIA APG standards.',
}

export default function PlaygroundPage() {
  return <PlaygroundView />
}
