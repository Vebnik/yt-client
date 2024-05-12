use serde::{Deserialize, Serialize};


#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Format {
    format_id: String,
    resolution: String,
    audio_ext: String,
    video_ext: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Video {
    id: String,
    title: String,
    duration: i32,
    view_count: i32,
    like_count: i32,
    channel: String,
    thumbnail: String,
    #[serde(default)]
    formats: Vec<Format>
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct DownloadData {
    video_title: String,
    downloaded_bytes: i32,
    // total_bytes: i32,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct DownloadQuery {
    pub id: String,
    pub path: String,
}