// Shared types for the music app

export type SelectedImage = {
  src: string;
  alt: string;
  largeSrc: string;
  trackUrl?: string;
}

export type Pictures = {
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

export type Result = {
  key: string;
  url: string;
  name: string;
  play_count: number;
  favorite_count: number;
  pictures: Pictures;
};

export type PlayerProps = {
  selectedImage: SelectedImage | null;
}

export type SearchProps = {
  onImageSelect: (image: SelectedImage, sourceElement: HTMLElement) => void;
}

export type MixCloudItemProps = {
  result: Result;
  onImageSelect: (image: SelectedImage, sourceElement: HTMLElement) => void;
}
