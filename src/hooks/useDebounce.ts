import { useEffect, useState } from "react";

/**
 * Returns a debounced version of the input value.
 *
 * The returned value only updates after the user stops changing `value` for
 * `delay` milliseconds. The pending timeout is cleared whenever the value or
 * delay changes, and when the component unmounts.
 *
 * @template T - The type of the value to debounce.
 * @param value - The raw input value.
 * @param delay - Debounce delay in milliseconds (default: 300).
 * @returns The debounced value.
 */
export function useDebounce<T>(value: T, delay = 300): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}
