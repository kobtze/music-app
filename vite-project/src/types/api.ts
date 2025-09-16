// API response types from external services (e.g., Mixcloud)

export type Pictures = {
  small: string;
  thumbnail: string;
  medium_mobile: string;
  medium: string;
  large: string;
  extra_large: string;
  "320wx320h": string;
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
