import { Video } from "../interface/video.interface";
import { invoke } from "@tauri-apps/api";

class VideoRepository {
    async search(query: string): Promise<Video> {
        return invoke("search", { query })
            // @ts-ignore
            .then((data: Video) => data)
            .catch(err => {
                alert(String(err))
                throw err
            })
    }
}

export default new VideoRepository()