export interface Format {
  format_id: string;
  resolution: string;
  audio_ext: string;
  video_ext: string;
}

export interface Video {
    id: string
    title: string
    duration: number
    view_count: number
    like_count: number
    channel: string
    thumbnail: string
    formats: Format[]
}

export interface TauriEvent {
  payload: DownloadData;
  id: number
}

export interface DownloadData {
  video_title: string
  downloaded_bytes: number
  total_bytes: number
}