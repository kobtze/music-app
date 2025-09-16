import { useState, useEffect } from 'react';

/**
 * Custom hook for managing localStorage with React state synchronization
 * @param key - The localStorage key
 * @param initialValue - Initial value if key doesn't exist
 * @returns [value, setValue, removeValue]
 */
export function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch {
      return initialValue;
    }
  });

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      localStorage.setItem(key, JSON.stringify(valueToStore));
      
      // Dispatch a custom event to notify other components in the same tab
      window.dispatchEvent(new CustomEvent('localStorageChange', {
        detail: { key, newValue: valueToStore }
      }));
    } catch {
      // Handle localStorage errors silently
    }
  };

  const removeValue = () => {
    try {
      setStoredValue(initialValue);
      localStorage.removeItem(key);
    } catch {
      // Handle localStorage errors silently
    }
  };

  // Listen for storage changes from other tabs and same tab
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === key && e.newValue !== null) {
        try {
          setStoredValue(JSON.parse(e.newValue));
        } catch {
          // Handle parse errors silently
        }
      }
    };

    const handleLocalStorageChange = (e: CustomEvent) => {
      if (e.detail.key === key) {
        setStoredValue(e.detail.newValue);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('localStorageChange', handleLocalStorageChange as EventListener);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('localStorageChange', handleLocalStorageChange as EventListener);
    };
  }, [key]);

  return [storedValue, setValue, removeValue] as const;
}
