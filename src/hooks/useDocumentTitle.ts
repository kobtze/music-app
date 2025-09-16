import { useEffect } from 'react';

/**
 * Custom hook to manage document title with a base name and optional suffix
 * @param baseTitle - The base title (e.g., "Jukebox")
 * @param suffix - Optional suffix to append (e.g., mix name)
 */
export function useDocumentTitle(baseTitle: string, suffix?: string) {
  useEffect(() => {
    const title = suffix ? `${baseTitle} - ${suffix}` : baseTitle;
    document.title = title;
    
    // Cleanup function to reset title when component unmounts
    return () => {
      document.title = baseTitle;
    };
  }, [baseTitle, suffix]);
}
