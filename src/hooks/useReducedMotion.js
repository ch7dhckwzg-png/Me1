import { useSyncExternalStore } from 'react'

const QUERY = '(prefers-reduced-motion: reduce)'

const subscribe = (onChange) => {
  const mq = window.matchMedia(QUERY)
  mq.addEventListener('change', onChange)
  return () => mq.removeEventListener('change', onChange)
}

const getSnapshot = () => window.matchMedia(QUERY).matches

/** Live `prefers-reduced-motion` value; updates if the user changes the OS setting. */
export default function useReducedMotion() {
  return useSyncExternalStore(subscribe, getSnapshot, () => false)
}
