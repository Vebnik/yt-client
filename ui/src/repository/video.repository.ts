import { Video } from "../interface/video.interface";
import { invoke } from "@tauri-apps/api";

class VideoRepository {
  async search(query: string): Promise<Video> {
    return (
      invoke("search", { query })
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        .then((data: Video) => data)
        .catch((err) => {
          alert(String(err));
          throw err;
        })
    );
  }

  async download(data: { id: string; path: string }): Promise<void> {
    return invoke("download", { data })
      .then(() => console.log("success"))
      .catch((err) => {
        alert(String(err));
        throw err;
      });
  }
}

export default new VideoRepository()