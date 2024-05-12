use std::process::Stdio;

use tokio::process::Command;

use crate::error::Error;


pub async fn check_ytdlp() -> Result<bool, Error> {
    let child = Command::new("yt-dlp")
        .arg("--version")
        .stderr(Stdio::null())
        .stdout(Stdio::null())
        .spawn()?
        .wait()
        .await?;
    
    Ok(match child.code().unwrap() {
        0 => true,
        _ => false,
    })
}