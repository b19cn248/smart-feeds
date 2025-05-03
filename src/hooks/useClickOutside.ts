// src/hooks/useClickOutside.ts
import { useEffect, useRef } from 'react';

export const useClickOutside = <T extends HTMLElement = HTMLDivElement>(
    handler: () => void,
    active = true
) => {
    const ref = useRef<T>(null);

    useEffect(() => {
        if (!active) return;

        const listener = (event: MouseEvent | TouchEvent) => {
            const element = ref.current;
            if (!element || element.contains(event.target as Node)) {
                return;
            }

            handler();
        };

        document.addEventListener('mousedown', listener);
        document.addEventListener('touchstart', listener);

        return () => {
            document.removeEventListener('mousedown', listener);
            document.removeEventListener('touchstart', listener);
        };
    }, [handler, active]);

    return ref;
};