import { useState, useEffect } from 'react';
import './Search.css';

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

function Search() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Result[]>([]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  const handleSearchWithQuery = async (searchQuery: string, saveToHistory: boolean = true) => {
    if (!searchQuery.trim()) return;
    
    const response = await fetch(`https://api.mixcloud.com/search/?q=${searchQuery}&type=cloudcast&limit=6`);
    const json = await response.json();
    setResults(json?.data || []);
    
    // Save to search history after successful search only if specified
    if (saveToHistory) {
      addToSearchHistory(searchQuery.trim());
    }
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
      handleSearchWithQuery(searchQuery, false);
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
      <button onClick={handleSearch}>Search</button>
    </div>
    <div className="search-results">
      {results.map((result) => (
        <MixCloudItem key={result.key} result={result} />
      ))}
    </div>
  </div>;
}

function MixCloudItem({ result }: { result: Result }) {
  return (
    <div className="mixcloud-item">
      <img src={result.pictures.thumbnail} alt={result.name} />
      <div className="mixcloud-item-text">{result.name}</div>
    </div>
  );
}

export default Search;
export { getSearchHistory };