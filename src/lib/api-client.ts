import { IVideo } from "@/models/Video";

export type videoDataForm = Omit<IVideo, "_id">

type FetchOptions = {
    method?: "GET" | "POST" | "PUT" | "DELETE",
    body?: any,
    headers?: Record<string, string>
}

class ApiClient {
    private async fetch<T>(
        endpoints: string,
        options: FetchOptions = {}
    ): Promise<T>{
        const {method= "GET", body, headers= {}} = options;

        const defaultHeaders = {
            "Content-Type": "application/json",
            ...headers
        }

        const res = await fetch(`/api${endpoints}`, {method, headers: defaultHeaders, 
            body: body ? JSON.stringify(body) : undefined
        });

        if(!res.ok){
            throw new Error(await res.text())
        }

        return res.json();
    }
    

    async getVideos(){
        return this.fetch<IVideo[]>("/videos");
    }

    async getAVideo(id: string){
        return this.fetch(`/videos/${id}`)
    }

    async createVideo(videoData: videoDataForm){
        return this.fetch("/videos", {
            method: "POST",
            body: videoData
        })
    }

}

export const apiClient  = new ApiClient()