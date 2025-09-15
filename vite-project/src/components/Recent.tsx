import { useState, useEffect } from 'react';
import { getSearchHistory } from './Search';
import './Search.css';

function Recent() {
  const [searchHistory, setSearchHistory] = useState<string[]>([]);

  useEffect(() => {
    // Load search history on component mount
    const loadHistory = () => {
      const history = getSearchHistory();
      setSearchHistory(history);
    };

    loadHistory();

    // Listen for storage changes to update history when searches are made
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'music-app-search-history') {
        loadHistory();
      }
    };

    window.addEventListener('storage', handleStorageChange);

    // Also check for changes periodically since storage events don't fire for same-tab changes
    const interval = setInterval(loadHistory, 1000);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, []);

  const handleRecentSearchClick = (query: string) => {
    // Dispatch a custom event that the Search component can listen to
    const event = new CustomEvent('recentSearchClick', { detail: query });
    window.dispatchEvent(event);
  };

  return (
    <div className="recent-container">
      <h3 className="recent-title">Recent Searches</h3>
      <div className="recent-list">
        {searchHistory.length === 0 ? (
          <div className="recent-empty">No recent searches</div>
        ) : (
          searchHistory.map((query, index) => (
            <div 
              key={index} 
              className="recent-item"
              onClick={() => handleRecentSearchClick(query)}
            >
              {query}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Recent;