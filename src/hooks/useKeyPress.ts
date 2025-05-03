import { useEffect, useCallback } from 'react';

export const useKeyPress = (
    targetKey: string,
    handler: (event: KeyboardEvent) => void,
    options: {
        preventDefault?: boolean;
        stopPropagation?: boolean;
        active?: boolean;
    } = {}
) => {
    const { preventDefault = false, stopPropagation = false, active = true } = options;

    const handleKeyDown = useCallback(
        (event: KeyboardEvent) => {
            if (!active) return;

            if (event.key === targetKey) {
                if (preventDefault) event.preventDefault();
                if (stopPropagation) event.stopPropagation();
                handler(event);
            }
        },
        [targetKey, handler, preventDefault, stopPropagation, active]
    );

    useEffect(() => {
        if (!active) return;

        document.addEventListener('keydown', handleKeyDown);
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [handleKeyDown, active]);
};