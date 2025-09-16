import { useState, useEffect } from 'react';
import './Player.css';
import type { SelectedImage, PlayerProps } from '../../types';

function Player({ selectedImage }: PlayerProps) {
  const [displayImage, setDisplayImage] = useState<SelectedImage | null>(null);
  const [imageKey, setImageKey] = useState(0);
  const [showEmbed, setShowEmbed] = useState(false);
  const [embedKey, setEmbedKey] = useState(0);

  useEffect(() => {
    if (selectedImage) {
      // Force re-render with new key for smooth transition
      setImageKey(prev => prev + 1);
      // Set new image - CSS transition will handle the fade-in
      setDisplayImage(selectedImage);
    }
  }, [selectedImage]);

  const handleImageClick = () => {
    if (displayImage?.trackUrl) {
      setShowEmbed(true);
      setEmbedKey(prev => prev + 1); // Force re-render for autoplay
    }
  };

  return (
    <div className="player-container">
      <div className="player-image-area">
        {displayImage ? (
          <img
            key={imageKey}
            src={displayImage.largeSrc}
            alt={displayImage.alt}
            className={`player-image fade-in ${displayImage.trackUrl ? 'clickable' : ''}`}
            onClick={handleImageClick}
            style={{ cursor: displayImage.trackUrl ? 'pointer' : 'default' }}
          />
        ) : (
          <div className="player-placeholder">
            <span>Click on a search result to display the album artwork, then click the image to play the track</span>
          </div>
        )}
      </div>
      {showEmbed && displayImage?.trackUrl && (
        <div className="mixcloud-embed-container">
          <iframe
            key={embedKey}
            width="100%"
            height="120"
            src={`https://www.mixcloud.com/widget/iframe/?feed=${encodeURIComponent(displayImage.trackUrl)}&autoplay=1&light=1`}
            frameBorder="0"
            allow="autoplay"
            title={`Mixcloud player for ${displayImage.alt}`}
          />
        </div>
      )}
    </div>
  );
}

export default Player;