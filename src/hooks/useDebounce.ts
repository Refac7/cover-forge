/* ========================================
   useDebounce — Generic value debouncer.
   Returns the debounced value after `delay` ms.
   ======================================== */

import { useState, useEffect } from 'react';

export function useDebounce<T>(value: T, delay = 200): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}
