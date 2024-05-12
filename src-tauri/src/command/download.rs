use std::io::{BufRead, BufReader};
use std::os::windows::process::CommandExt;
use std::process::Stdio;
use tauri::{self, Manager};

use shared_child::SharedChild;

use crate::command::utils;
use crate::error::Error;
use crate::types::{DownloadData, DownloadQuery};

#[tauri::command]
pub async fn download(data: DownloadQuery, app: tauri::AppHandle) -> Result<bool, Error> {
    let exist = utils::check_ytdlp().await?;

    if !exist {
        Err(Error::Custom("Not found yt-dlp binary".to_string()))?
    }

    let mut command = std::process::Command::new("yt-dlp");

    let mut args = vec![
        "--progress-template",
        r#"'__{"type": "downloading", "video_title": "%(info.title)s", "downloaded_bytes": %(progress.downloaded_bytes)s, "elapsed": %(progress.elapsed)s}'"#,
    ];

    args.push(&data.id);
    args.push("-o");
    args.push(&data.path);

    let Ok(shared_child) = SharedChild::spawn(
        command
            .args(args)
            .stderr(Stdio::piped())
            .stdout(Stdio::piped())
            .creation_flags(0x08000000),
    ) else {
        Err(Error::Custom("".to_string()))?
    };

    let stdout = shared_child.take_stdout().unwrap();
    let mut reader = BufReader::new(stdout);
    
    loop {
        let mut buffer = vec![];    
        let bytes = reader.read_until(b'\r', &mut buffer).unwrap();

        if bytes == 0 {
            app.emit_all("downloaded", false).unwrap();
            break;
        }

        let download_data: String = String::from_utf8_lossy(&buffer).to_string();

        if download_data.contains("type\": \"downloading") {
            let download_data = download_data.replace("__", "").replace("'", "");

            println!("{download_data}");

            let payload = serde_json::from_str::<DownloadData>(&download_data);

            match payload {
                Ok(data) => app.emit_all("download", data).unwrap(),
                Err(err) => println!("Some error on parse progress: {err}"),
                
            }
        };
    }

    Ok(true)
}
