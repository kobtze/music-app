import { useLocalStorage } from './useLocalStorage';
import { SEARCH_HISTORY_KEY, SEARCH_HISTORY_SIZE } from '../config/constants';

/**
 * Custom hook for managing search history with localStorage
 * @returns [searchHistory, addToHistory, clearHistory]
 */
export function useSearchHistory() {
  const [searchHistory, setSearchHistory, clearHistory] = useLocalStorage<string[]>(
    SEARCH_HISTORY_KEY,
    []
  );

  const addToHistory = (query: string) => {
    if (!query.trim()) return;
    
    setSearchHistory(prevHistory => {
      // Remove if already exists to avoid duplicates
      const filteredHistory = prevHistory.filter(item => item !== query);
      // Add to beginning
      const newHistory = [query, ...filteredHistory];
      // Keep only last N items
      return newHistory.slice(0, SEARCH_HISTORY_SIZE);
    });
  };

  return [searchHistory, addToHistory, clearHistory] as const;
}
