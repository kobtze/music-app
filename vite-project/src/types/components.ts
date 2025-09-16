// Component prop types

import type { SelectedImage, ImageSelectHandler } from './shared';
import type { Result } from './api';

export type PlayerProps = {
  selectedImage: SelectedImage | null;
};

export type SearchProps = {
  onImageSelect: ImageSelectHandler;
};

export type MixcloudItemProps = {
  result: Result;
  onImageSelect: ImageSelectHandler;
};
