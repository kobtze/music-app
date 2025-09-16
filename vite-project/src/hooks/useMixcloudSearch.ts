import { useState, useCallback } from 'react';
import { MIXCLOUD_API_BASE, SEARCH_LIMIT } from '../config/constants';
import type { Result } from '../types/api';

interface SearchResponse {
  data: Result[];
  paging?: {
    next?: string;
  };
}

interface UseMixcloudSearchReturn {
  results: Result[];
  isLoading: boolean;
  hasNextPage: boolean;
  nextOffset: number;
  notFound: boolean;
  search: (query: string, offset?: number) => Promise<void>;
  reset: () => void;
}

/**
 * Custom hook for Mixcloud search functionality
 * @returns Search state and methods
 */
export function useMixcloudSearch(): UseMixcloudSearchReturn {
  const [results, setResults] = useState<Result[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [nextOffset, setNextOffset] = useState(0);
  const [notFound, setNotFound] = useState(false);

  const search = useCallback(async (query: string, offset: number = 0) => {
    if (!query.trim()) return;
    
    setIsLoading(true);
    try {
      const response = await fetch(
        `${MIXCLOUD_API_BASE}/search/?q=${query}&type=cloudcast&limit=${SEARCH_LIMIT}&offset=${offset}`
      );
      
      if (!response.ok) {
        throw new Error(`Search failed: ${response.status}`);
      }
      
      const json: SearchResponse = await response.json();
      const searchResults = json?.data || [];
      
      setResults(searchResults);
      setNotFound(searchResults.length === 0);
      
      // Check if there are more results
      if (json?.paging?.next && typeof json.paging.next === 'string') {
        setHasNextPage(true);
        setNextOffset(offset + SEARCH_LIMIT);
      } else {
        setHasNextPage(false);
      }
    } catch (error) {
      console.error('Search error:', error);
      setResults([]);
      setNotFound(true);
      setHasNextPage(false);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setResults([]);
    setIsLoading(false);
    setHasNextPage(false);
    setNextOffset(0);
    setNotFound(false);
  }, []);

  return {
    results,
    isLoading,
    hasNextPage,
    nextOffset,
    notFound,
    search,
    reset
  };
}
