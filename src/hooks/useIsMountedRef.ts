import { useRef, useEffect, MutableRefObject } from "react";

export default function useIsMountedRef(): MutableRefObject<boolean> {
    const isMounted = useRef<boolean>(true);

    useEffect(
        () => () => {
            isMounted.current = false;
        },
        []
    );

    return isMounted;
}
