// Shared domain types used across multiple features

export type SelectedImage = {
  src: string;
  alt: string;
  largeSrc: string;
  trackUrl?: string;
};

// Common prop pattern for image selection handlers
export type ImageSelectHandler = (image: SelectedImage, sourceElement: HTMLElement) => void;
