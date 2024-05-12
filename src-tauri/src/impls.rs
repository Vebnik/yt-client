use tokio::process::Command;

use crate::{error::Error, types::Video};

impl Video {
    pub async fn get_info(query: String) -> Result<Self, Error> {
        let out = Command::new("yt-dlp")
            .arg(query)
            .arg("--skip-download")
            .arg("--dump-single-json")
            .arg("--no-check-certificate")
            .arg("--restrict-filenames")
            .arg("--ignore-no-formats-error")
            .output().await?;

        let raw_str = String::from_utf8(out.stdout)
            .map_err(|_| Error::Custom("Raw STR".to_string()))?;

        let data: Self = serde_json::from_str(&raw_str)
            .map_err(|_| Error::Custom("Parse JSON".to_string()))?;

        Ok(data)
    }
}