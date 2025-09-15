import { useState, useEffect } from 'react';
import './Player.css';

type SelectedImage = {
  src: string;
  alt: string;
  largeSrc: string;
}

type PlayerProps = {
  selectedImage: SelectedImage | null;
}

function Player({ selectedImage }: PlayerProps) {
  const [displayImage, setDisplayImage] = useState<SelectedImage | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [imageKey, setImageKey] = useState(0);

  useEffect(() => {
    if (selectedImage) {
      // Reset visibility first
      setIsVisible(false);
      // Force re-render with new key
      setImageKey(prev => prev + 1);
      // Set new image
      setDisplayImage(selectedImage);
      // Start fade-in after a brief delay
      const timer = setTimeout(() => setIsVisible(true), 100);
      return () => clearTimeout(timer);
    }
  }, [selectedImage]);

  const handleImageLoad = () => {
    // Trigger fade-in when image loads
    setIsVisible(true);
  };

  return (
    <div className="player-container">
      <h3 className="player-title">Player</h3>
      <div className="player-image-area">
        {displayImage ? (
          <img
            key={imageKey}
            src={displayImage.largeSrc}
            alt={displayImage.alt}
            className={`player-image ${isVisible ? 'fade-in' : ''}`}
            onLoad={handleImageLoad}
          />
        ) : (
          <div className="player-placeholder">
            <span>Click on a search result to display the album artwork</span>
          </div>
        )}
      </div>
    </div>
  );
}

export default Player;