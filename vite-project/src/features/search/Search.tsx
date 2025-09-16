import { useState, useEffect } from 'react';
import './Search.css';
import type { SelectedImage, SearchProps, MixcloudItemProps } from '../../types';
import { useMixcloudSearch } from '../../hooks/useMixcloudSearch';
import { useSearchHistory } from '../../hooks/useSearchHistory';


function Search({ onImageSelect }: SearchProps) {
  const [query, setQuery] = useState('');
  const { results, isLoading, hasNextPage, nextOffset, notFound, search, reset } = useMixcloudSearch();
  const [_, addToHistory] = useSearchHistory();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  const handleSearchWithQuery = async (searchQuery: string, saveToHistory: boolean = true, offset: number = 0) => {
    if (!searchQuery.trim()) return;
    
    await search(searchQuery, offset);
    
    // Save to search history after successful search only if specified
    if (saveToHistory) {
      addToHistory(searchQuery.trim());
    }
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
    {notFound && (
      <div className="not-found">
        <p>No results found</p>
      </div>
    )}
    <div className="search-results">
      {results.map((result) => (
        <MixcloudItem key={result.key} result={result} onImageSelect={onImageSelect} />
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