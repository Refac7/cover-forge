/* ========================================
   useDebounce — Generic value debouncer.
   Returns the debounced value after `delay` ms.
   ======================================== */

import { useState, useEffect } from 'react';

export function useDebounce(value, delay = 200) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}
