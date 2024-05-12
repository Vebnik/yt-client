use crate::command::utils;
use crate::error::Error;
use crate::types::Video;

#[tauri::command]
pub async fn search(query: String) -> Result<Video, Error> {
    let exist = utils::check_ytdlp().await?;

    if !exist {
        Err(Error::Custom("Not found yt-dlp binary".to_string()))?
    }

    Ok(Video::get_info(query).await?)
}
