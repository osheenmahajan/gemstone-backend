import { useEffect, useRef } from 'react';

// Keeps the given setter from running when the next value is referentially identical.
// This is a best-effort hook and may still be flagged by some ESLint rules;
// page components can opt to avoid effects entirely.
export default function useSyncStateFromProps({ value, setValue }) {
  const last = useRef(value);

  useEffect(() => {
    if (Object.is(last.current, value)) return;
    last.current = value;
    setValue(value);
  }, [value, setValue]);
}

