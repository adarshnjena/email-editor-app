import { useRef, useEffect, MutableRefObject } from 'react';

export function useIsMountedRef(): MutableRefObject<boolean> {
  const isMounted = useRef<boolean>(true);

  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  return isMounted;
}
