import { useEffect, useRef } from "react";

const SEQUENCE = [
  "ArrowUp",
  "ArrowUp",
  "ArrowDown",
  "ArrowDown",
  "ArrowLeft",
  "ArrowRight",
  "ArrowLeft",
  "ArrowRight",
  "b",
  "a",
];

export function useKonami(onUnlock: () => void) {
  const index = useRef(0);
  const callback = useRef(onUnlock);
  callback.current = onUnlock;

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      const key = event.key.length === 1 ? event.key.toLowerCase() : event.key;
      const expected = SEQUENCE[index.current];
      if (key === expected) {
        index.current += 1;
        if (index.current === SEQUENCE.length) {
          index.current = 0;
          callback.current();
        }
        return;
      }
      index.current = key === SEQUENCE[0] ? 1 : 0;
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);
}
