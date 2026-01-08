export interface VideoMetadata {
  title: string;
  channel: string;
  views?: string;
  description?: string;
  summary?: string;
  tags?: string[];
  thumbnailUrl?: string; 
}

export interface SearchResult {
  metadata: VideoMetadata | null;
  groundingSources: Array<{
    uri: string;
    title: string;
  }>;
}

export enum AppState {
  IDLE = 'IDLE',
  ANALYZING = 'ANALYZING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR'
}