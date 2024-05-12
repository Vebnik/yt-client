use std::io::{BufRead, BufReader};
use std::process::Stdio;

use shared_child::SharedChild;

use crate::command::utils;
use crate::error::Error;

#[tauri::command]
pub async fn download(url: String) -> Result<bool, Error> {
    let exist = utils::check_ytdlp().await?;

    if !exist {
        Err(Error::Custom("Not found yt-dlp binary".to_string()))?
    }

    let mut command = std::process::Command::new("yt-dlp");

    let mut args = vec![
        "--progress-template",
        r#"'__{"type": "downloading", "video_title": "%(info.title)s", "eta": %(progress.eta)s, "downloaded_bytes": %(progress.downloaded_bytes)s, "total_bytes": %(progress.total_bytes)s, "elapsed": %(progress.elapsed)s, "speed": %(progress.speed)s, "playlist_count": %(info.playlist_count)s, "playlist_index": %(info.playlist_index)s }'"#,
        "-no-quiet"
    ];

    args.push(&url);

    let Ok(shared_child) = SharedChild::spawn(
        command
            .args(args)
            .stderr(Stdio::piped())
            .stdout(Stdio::piped()),
    ) else {
        Err(Error::Custom("".to_string()))?
    };

    let stdout = shared_child.take_stdout().unwrap();
    let mut reader = BufReader::new(stdout);
    let mut buffer = vec![];

    loop {
        let bytes = reader.read_until(b'\r', &mut buffer).unwrap();

        if bytes == 0 { break; }

        println!("{}", String::from_utf8_lossy(&buffer).to_string())
    }

    Ok(true)
}
