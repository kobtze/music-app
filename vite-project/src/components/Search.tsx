import { useState, useEffect } from 'react';
import './Search.css';

type SelectedImage = {
  src: string;
  alt: string;
  largeSrc: string;
  trackUrl?: string;
}

// localStorage utilities for search history
const SEARCH_HISTORY_KEY = 'music-app-search-history';

const getSearchHistory = (): string[] => {
  try {
    const history = localStorage.getItem(SEARCH_HISTORY_KEY);
    return history ? JSON.parse(history) : [];
  } catch {
    return [];
  }
};

const addToSearchHistory = (query: string): void => {
  if (!query.trim()) return;
  
  const history = getSearchHistory();
  // Remove if already exists to avoid duplicates
  const filteredHistory = history.filter(item => item !== query);
  // Add to beginning
  const newHistory = [query, ...filteredHistory];
  // Keep only last 5
  const limitedHistory = newHistory.slice(0, 5);
  
  try {
    localStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(limitedHistory));
  } catch {
    // Handle localStorage errors silently
  }
};

type Result = {
  key: string;
  url: string
  name: string;
  play_count: number;
  favorite_count: number;
  pictures: Pictures;
};

type Pictures = {
"small": string;
"thumbnail": string;
"medium_mobile": string;
"medium": string;
"large": string;
"320wx320h": string;
"extra_large": string;
"640wx640h": string;
"768wx768h": string;
"1024wx1024h": string;
};

type SearchProps = {
  onImageSelect: (image: SelectedImage, sourceElement: HTMLElement) => void;
}

function Search({ onImageSelect }: SearchProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Result[]>([]);
  const [nextOffset, setNextOffset] = useState(0);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [notFound, setNotFound] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  const handleSearchWithQuery = async (searchQuery: string, saveToHistory: boolean = true, offset: number = 0) => {
    if (!searchQuery.trim()) return;
    
    setIsLoading(true);
    const response = await fetch(`https://api.mixcloud.com/search/?q=${searchQuery}&type=cloudcast&limit=6&offset=${offset}`);
    const json = await response.json();
    setResults(json?.data || []);
    
    // Save to search history after successful search only if specified
    if (saveToHistory) {
      addToSearchHistory(searchQuery.trim());
    }
    // set not found state
    setNotFound(json?.data?.length === 0 ? true : false);

    // Check if there are more results by looking at json.paging.next
    setHasNextPage(json?.paging?.next ? true : false);

    if (hasNextPage) {
      setNextOffset(offset + 6);
    }

    setIsLoading(false);
  };

  const handleNextPage = async () => {
    await handleSearchWithQuery(query, false, nextOffset);
  };

  const handleSearch = async () => {
    await handleSearchWithQuery(query, true);
  };

  // Listen for recent search clicks
  useEffect(() => {
    const handleRecentSearchClick = (event: any) => {
      const searchQuery = event.detail;
      setQuery(searchQuery);
      // Automatically trigger search without saving to history
      setNextOffset(0);
      handleSearchWithQuery(searchQuery, false, nextOffset);
    };

    window.addEventListener('recentSearchClick', handleRecentSearchClick);
    
    return () => {
      window.removeEventListener('recentSearchClick', handleRecentSearchClick);
    };
  }, [handleSearchWithQuery]);

  return <div className="search-container">
    <div className="search-input-row">
      <input 
        type="text" 
        value={query} 
        onChange={handleInputChange} 
        className="search-input"
        placeholder="Search music..."
      />
      <button onClick={handleSearch} className="search-button">Search</button>
    </div>
    {notFound && (
      <div className="not-found">
        <p>No results found</p>
      </div>
    )}
    <div className="search-results">
      {results.map((result) => (
        <MixCloudItem key={result.key} result={result} onImageSelect={onImageSelect} />
      ))}
    </div>
    {hasNextPage && (
      <div className="pagination-controls">
        <button onClick={handleNextPage} className="next-button" disabled={isLoading}>
          {isLoading ? 'Loading...' : 'Next'}
        </button>
      </div>
    )}
  </div>;
}

type MixCloudItemProps = {
  result: Result;
  onImageSelect: (image: SelectedImage, sourceElement: HTMLElement) => void;
}

function MixCloudItem({ result, onImageSelect }: MixCloudItemProps) {
  const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
    const imageElement = event.currentTarget.querySelector('img');
    if (imageElement) {
      const selectedImage: SelectedImage = {
        src: result.pictures.thumbnail,
        alt: result.name,
        largeSrc: result.pictures.large || result.pictures.extra_large || result.pictures.medium,
        trackUrl: result.url
      };
      onImageSelect(selectedImage, imageElement);
    }
  };

  return (
    <div className="mixcloud-item" onClick={handleClick}>
      <img src={result.pictures.thumbnail} alt={result.name} />
      <div className="mixcloud-item-text">{result.name}</div>
    </div>
  );
}

export default Search;
export { getSearchHistory };