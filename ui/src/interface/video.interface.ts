export interface Format {
    format_id: String
    resolution: String
    audio_ext: String
    video_ext: String
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