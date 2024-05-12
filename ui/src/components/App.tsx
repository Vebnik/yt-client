import { useEffect, useState } from 'react'
import videoRepository from '../repository/video.repository'
import { DownloadData, TauriEvent, Video } from '../interface/video.interface'
import { listen } from "@tauri-apps/api/event";

import '../css/App.css'
import { save } from '@tauri-apps/api/dialog';

function App() {
  const [query, setQuery] = useState<string>('')
  const [video, setVideo] = useState<Video>()
  const [data, setData] = useState<DownloadData>();
  const [path, setPath] = useState<string>('');
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [isDownloaded, setIsDownloaded] = useState<boolean>(false);

  const getInfo = () => {
    setIsCompleted(false);
    setData(undefined);
    setVideo(undefined);

    videoRepository.search(query)
      .then(data => setVideo(data))
  }

  const download = async () => {
    if (!video) return;

    const filePath = await save({
      filters: [
        {
          name: "",
          extensions: ["webm", "mp4"],
        },
      ],
      defaultPath: video.title,
    });

    setPath(`${filePath}`);
    setIsCompleted(false);
    setIsDownloaded(true);

    videoRepository.download({ id: video.id, path: `${filePath}` });
  };

  const startListen = async () => {
    await listen<TauriEvent>("download", (event) => {
      console.log(event);
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      setData(event.payload);
      setIsDownloaded(true)
    });

    await listen<TauriEvent>("downloaded", (event) => {
      console.log(event);

      setIsCompleted(true);
      setIsDownloaded(false);
      setData(undefined);
      setVideo(undefined);
    });
  }

  useEffect(() => {
    console.log("register listener to download");
    startListen()
  }, [])

  return (
    <div className="main-section">
      <div className="search-bar">
        <label className="my-input-box">
          Video ID or URL
          <input
            value={query}
            onChange={(ev) => setQuery(ev.target.value)}
            placeholder="https:// ..."
          />
        </label>
        <button onClick={getInfo} className="my-btn">
          <span style={{ fontSize: "25px" }}>🔎</span>
        </button>
      </div>
      <div className="divider" />

      {isDownloaded ? (
        <div style={{ margin: "auto" }}>
          {data?.downloaded_bytes} / {data?.total_bytes || "NA"} (bytes)
        </div>
      ) : (
        <></>
      )}

      {isCompleted ? (
        <div style={{ margin: "auto" }}>
          Saved to <br />
          {path}
        </div>
      ) : (
        <></>
      )}

      {!video ? (
        <div style={{ margin: "auto" }}>{isCompleted ? "✅" : "🔄"}</div>
      ) : isDownloaded ? (
        <></>
      ) : (
        <div className="preview">
          <div className="info">
            <span className="into-title">{video?.title.slice(0, 32)} ...</span>
            <div>
              <img src={video?.thumbnail} width={"200px"} height={"110px"} />
            </div>
            <span style={{ color: "yellow" }}>Channel:</span> {video?.channel}
            <br />
            <span style={{ color: "yellow" }}>Duration:</span> {video?.duration}{" "}
            sec
            <br />
            <span style={{ color: "yellow" }}>Views:</span> {video?.view_count}
            <br />
          </div>
          <div className="formats">
            <select className="format-select">
              <option>Best quality</option>
              {video?.formats.map((el) => (
                <option>
                  {el.format_id} ({el.video_ext} + {el.audio_ext})
                </option>
              ))}
            </select>
            <button onClick={download}>Download</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App
