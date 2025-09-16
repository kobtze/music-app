// Component prop types

import type { SelectedImage } from './shared';
import type { Result } from './api';

export type PlayerProps = {
  selectedImage: SelectedImage | null;
};

export type SearchProps = {
  onImageSelect: (image: SelectedImage, sourceElement: HTMLElement) => void;
};

export type MixCloudItemProps = {
  result: Result;
  onImageSelect: (image: SelectedImage, sourceElement: HTMLElement) => void;
};
