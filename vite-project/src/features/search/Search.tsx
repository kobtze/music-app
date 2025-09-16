import { useState, useEffect } from 'react';
import './Search.css';
import type { SelectedImage, SearchProps, MixcloudItemProps } from '../../types';
import { useMixcloudSearch } from '../../hooks/useMixcloudSearch';
import { useSearchHistory } from '../../hooks/useSearchHistory';
import { useLocalStorage } from '../../hooks/useLocalStorage';

// Simple loading spinner
function LoadingSpinner() {
  return (
    <div className="loading-spinner">
      <div className="spinner"></div>
      <span>Loading...</span>
    </div>
  );
}

// Error display component
function ErrorDisplay({ error, onRetry }: { error: string; onRetry: () => void }) {
  return (
    <div className="error-display">
      <div className="error-icon">⚠️</div>
      <div className="error-message">{error}</div>
      <button onClick={onRetry} className="retry-button">
        Try Again
      </button>
    </div>
  );
}


function Search({ onImageSelect }: SearchProps) {
  const [query, setQuery] = useState('');
  const { results, isLoading, hasNextPage, nextOffset, notFound, error, search, reset } = useMixcloudSearch();
  const [_, addToHistory] = useSearchHistory();
  const [viewMode, setViewMode] = useLocalStorage<'list' | 'tile'>('searchViewMode', 'list');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  const handleSearchWithQuery = async (searchQuery: string, saveToHistory: boolean = true, offset: number = 0) => {
    if (!searchQuery.trim()) return;
    
    const success = await search(searchQuery, offset);
    
    // Save to search history only if search succeeded and saveToHistory is true
    if (success && saveToHistory) {
      addToHistory(searchQuery.trim());
    }
  };

  const handleNextPage = async () => {
    await handleSearchWithQuery(query, false, nextOffset);
  };

  const handleSearch = async () => {
    await handleSearchWithQuery(query, true);
  };

  const handleRetry = async () => {
    await handleSearchWithQuery(query, true);
  };

  // Listen for recent search clicks
  useEffect(() => {
    const handleRecentSearchClick = (event: any) => {
      const searchQuery = event.detail;
      setQuery(searchQuery);
      // Automatically trigger search without saving to history
      reset();
      handleSearchWithQuery(searchQuery, false, 0);
    };

    window.addEventListener('recentSearchClick', handleRecentSearchClick);
    
    return () => {
      window.removeEventListener('recentSearchClick', handleRecentSearchClick);
    };
  }, [handleSearchWithQuery, reset]);

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
    {error && (
      <ErrorDisplay error={error} onRetry={handleRetry} />
    )}
    {notFound && !error && (
      <div className="not-found">
        <p>No results found</p>
      </div>
    )}
    <div className={`search-results ${viewMode === 'tile' ? 'tile-view' : 'list-view'}`}>
      {isLoading ? (
        <LoadingSpinner />
      ) : (
        results.map((result) => (
          <MixcloudItem key={result.key} result={result} onImageSelect={onImageSelect} />
        ))
      )}
    </div>
    <div className="pagination-controls">
      {hasNextPage && (
        <button onClick={handleNextPage} className="next-button" disabled={isLoading}>
          {isLoading ? 'Loading...' : 'Next'}
        </button>
      )}
      <div className="view-toggle-row">
        <button 
          onClick={() => setViewMode('list')} 
          className={`view-toggle-button ${viewMode === 'list' ? 'active' : ''}`}
        >
          List
        </button>
        <button 
          onClick={() => setViewMode('tile')} 
          className={`view-toggle-button ${viewMode === 'tile' ? 'active' : ''}`}
        >
          Tile
        </button>
      </div>
    </div>
    
  </div>;
}

function MixcloudItem({ result, onImageSelect }: MixcloudItemProps) {
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