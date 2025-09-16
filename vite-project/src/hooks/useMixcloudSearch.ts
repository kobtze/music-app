import { useState, useCallback } from 'react';
import { MIXCLOUD_API_BASE, SEARCH_LIMIT } from '../config/constants';
import type { Result } from '../types/api';

// Custom error types for better error handling
class NetworkError extends Error {
  constructor(message: string = 'Network error. Please check your internet connection and try again.') {
    super(message);
    this.name = 'NetworkError';
  }
}

class APIError extends Error {
  statusCode?: number;
  
  constructor(message: string, statusCode?: number) {
    super(message);
    this.name = 'APIError';
    this.statusCode = statusCode;
  }
}

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
  error: string | null;
  search: (query: string, offset?: number) => Promise<boolean>;
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
  const [error, setError] = useState<string | null>(null);

  const search = useCallback(async (query: string, offset: number = 0): Promise<boolean> => {
    if (!query.trim()) return false;
    
    setIsLoading(true);
    setError(null);
    setNotFound(false);
    
    try {
      const response = await fetch(
        `${MIXCLOUD_API_BASE}/search/?q=${query}&type=cloudcast&limit=${SEARCH_LIMIT}&offset=${offset}`
      );
      
      if (!response.ok) {
        if (response.status === 429) {
          throw new APIError('Too many requests. Please wait a moment and try again.', 429);
        } else if (response.status >= 500) {
          throw new APIError('Mixcloud service is temporarily unavailable. Please try again later.', response.status);
        } else if (response.status === 404) {
          throw new APIError('Search service not found. Please check your connection.', 404);
        } else {
          throw new APIError(`Search failed. Please try again. (Error: ${response.status})`, response.status);
        }
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
      
      return true; // Search succeeded
    } catch (error) {
      console.error('Search error:', error);
      setResults([]);
      setNotFound(false);
      setHasNextPage(false);
      
      // Set user-friendly error message based on error type
      if (error instanceof APIError || error instanceof NetworkError) {
        setError(error.message);
      } else if (error instanceof TypeError && error.message.includes('fetch')) {
        setError('Network error. Please check your internet connection and try again.');
      } else {
        setError('An unexpected error occurred. Please try again.');
      }
      
      return false; // Search failed
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
    setError(null);
  }, []);

  return {
    results,
    isLoading,
    hasNextPage,
    nextOffset,
    notFound,
    error,
    search,
    reset
  };
}
