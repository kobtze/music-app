// localStorage utilities for search history
import { SEARCH_HISTORY_KEY, SEARCH_HISTORY_SIZE } from '../config/constants';

/**
 * Retrieves the search history from localStorage
 * @returns Array of search history strings, or empty array if none found
 */
export const getSearchHistory = (): string[] => {
  try {
    const history = localStorage.getItem(SEARCH_HISTORY_KEY);
    return history ? JSON.parse(history) : [];
  } catch {
    return [];
  }
};

/**
 * Adds a search query to the search history
 * @param query - The search query to add to history
 */
export const addToSearchHistory = (query: string): void => {
  if (!query.trim()) return;
  
  const history = getSearchHistory();
  // Remove if already exists to avoid duplicates
  const filteredHistory = history.filter(item => item !== query);
  // Add to beginning
  const newHistory = [query, ...filteredHistory];
  // Keep only last N items
  const limitedHistory = newHistory.slice(0, SEARCH_HISTORY_SIZE);
  
  try {
    localStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(limitedHistory));
  } catch {
    // Handle localStorage errors silently
  }
};
