import { useState, useCallback } from 'react';
import type { SelectedImage } from '../types';

export const useImageAnimation = () => {
  const [isAnimating, setIsAnimating] = useState(false);

  const animateImageSelection = useCallback((
    image: SelectedImage, 
    sourceElement: HTMLElement,
    onComplete: (image: SelectedImage) => void
  ) => {
    if (isAnimating) return; // Prevent multiple animations
    
    setIsAnimating(true);
    
    // Create flying image element
    const flyingImage = document.createElement('img');
    flyingImage.src = image.src;
    flyingImage.alt = image.alt;
    flyingImage.className = 'flying-image';
    
    // Get source and target positions
    const sourceRect = sourceElement.getBoundingClientRect();
    const playerElement = document.querySelector('.player-container');
    const targetRect = playerElement?.getBoundingClientRect();
    
    if (!targetRect) {
      setIsAnimating(false);
      return;
    }
    
    // Position the flying image at source location
    flyingImage.style.position = 'fixed';
    flyingImage.style.left = `${sourceRect.left}px`;
    flyingImage.style.top = `${sourceRect.top}px`;
    flyingImage.style.width = `${sourceRect.width}px`;
    flyingImage.style.height = `${sourceRect.height}px`;
    flyingImage.style.zIndex = '1000';
    flyingImage.style.borderRadius = '4px';
    flyingImage.style.objectFit = 'cover';
    flyingImage.style.transition = 'all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
    flyingImage.style.pointerEvents = 'none';
    
    document.body.appendChild(flyingImage);
    
    // Fade out the source element
    sourceElement.style.transition = 'opacity 0.3s ease';
    sourceElement.style.opacity = '0.3';
    
    // Trigger the fly animation
    requestAnimationFrame(() => {
      const centerX = targetRect.left + targetRect.width / 2;
      const centerY = targetRect.top + targetRect.height / 2;
      
      flyingImage.style.left = `${centerX - 100}px`;
      flyingImage.style.top = `${centerY - 100}px`;
      flyingImage.style.width = '200px';
      flyingImage.style.height = '200px';
      flyingImage.style.opacity = '0';
    });
    
    // After animation completes
    setTimeout(() => {
      document.body.removeChild(flyingImage);
      onComplete(image);
      setIsAnimating(false);
      
      // Reset source element
      sourceElement.style.opacity = '1';
    }, 800);
  }, [isAnimating]);

  return {
    isAnimating,
    animateImageSelection
  };
};
