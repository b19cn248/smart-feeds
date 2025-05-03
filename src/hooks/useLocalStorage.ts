// src/hooks/useLocalStorage.ts
import { useState, useEffect } from 'react';

type SetValue<T> = T | ((val: T) => T);

export function useLocalStorage<T>(
    key: string,
    initialValue: T
): [T, (value: SetValue<T>) => void] {
    // Get from local storage then parse stored json or return initialValue
    const readValue = (): T => {
        // Prevent build error "window is undefined"
        if (typeof window === 'undefined') {
            return initialValue;
        }

        try {
            const item = window.localStorage.getItem(key);
            return item ? (JSON.parse(item) as T) : initialValue;
        } catch (error) {
            console.warn(`Error reading localStorage key "${key}":`, error);
            return initialValue;
        }
    };

    // State to store our value
    const [storedValue, setStoredValue] = useState<T>(readValue);

    // useEffect to update local storage when the state changes
    useEffect(() => {
        // Prevent build error "window is undefined"
        if (typeof window === 'undefined') {
            return;
        }

        try {
            const valueToStore = storedValue;
            window.localStorage.setItem(key, JSON.stringify(valueToStore));
        } catch (error) {
            console.warn(`Error setting localStorage key "${key}":`, error);
        }
    }, [key, storedValue]);

    // Return a wrapped version of useState's setter function
    const setValue = (value: SetValue<T>) => {
        try {
            // Allow value to be a function for the same API as useState
            const valueToStore = value instanceof Function ? value(storedValue) : value;
            setStoredValue(valueToStore);
        } catch (error) {
            console.warn(`Error setting localStorage key "${key}":`, error);
        }
    };

    return [storedValue, setValue];
}