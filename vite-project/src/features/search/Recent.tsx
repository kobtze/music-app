import { useSearchHistory } from '../../hooks/useSearchHistory';
import './Recent.css';

function Recent() {
  const [searchHistory] = useSearchHistory();

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