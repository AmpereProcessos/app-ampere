import { useEffect } from "react";
import { useRef } from "react";

export function useKey(key, cb) {
  const callbackRef = useRef(cb);
  useEffect(() => {
    callbackRef.current = cb;
  }, [cb]);
  useEffect(() => {
    function handle(event) {
      if (event.code === key) {
        callbackRef.current(event);
      }
    }
    document.addEventListener("keydown", handle);
    return () => document.removeEventListener("keypress", handle);
  }, [key]);
}
