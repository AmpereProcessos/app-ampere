import { useEffect } from 'react'
import { useRef } from 'react'

export function useKey(key, cb) {
  const callbackRef = useRef(cb)
  useEffect(() => {
    callbackRef.current = cb
  }, [cb])
  useEffect(() => {
    function handle(event) {
      if (event.code === key) {
        callbackRef.current(event)
      }
    }
    document.addEventListener('keydown', handle)
    return () => document.removeEventListener('keypress', handle)
  }, [key])
}
export function useClickOutside(ref, cb) {
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        cb()
      }
    }
    document.addEventListener('click', (e) => handleClickOutside(e), true)
    return () => {
      document.removeEventListener('click', (e) => handleClickOutside(e), true)
    }
  }, [cb])
}
