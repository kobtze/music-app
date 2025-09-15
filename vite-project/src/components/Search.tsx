import { useState } from 'react';
import './Search.css';

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
  const handleSearch = async () => {
    const response = await fetch(`https://api.mixcloud.com/search/?q=${query}&type=cloudcast&limit=6`);
    const json = await response.json();
    setResults(json?.data || []);
  };

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