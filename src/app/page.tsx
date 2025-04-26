"use client";
import { apiClient } from "@/lib/api-client";
import { IVideo } from "@/models/Video";
import { Video } from "@imagekit/next";
import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import Link from "next/link";

export default function Home() {
  const { data: session, status } = useSession();
  const [videos, setVideos] = useState<IVideo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        setLoading(true);
        const data = await apiClient.getVideos();
        setVideos(data);
      } catch (error) {
        console.error("Error while fetching videos: ", error);
      } finally {
        setLoading(false);
      }
    };

    if (status === "authenticated") {
      fetchVideos();
    }
  }, [status]);

  if (status === "loading") {
    return (
      <div className="min-h-screen w-full bg-gray-900 flex justify-center items-center">
        <Loader2 className="animate-spin text-primary w-12 h-12" />
      </div>
    );
  }

  if (status === "unauthenticated") {
    return (
      <div className="min-h-screen w-full bg-gray-900 flex justify-center items-center">
        <h2 className="text-white font-bold text-2xl">
          Please log in to view video.
        </h2>
        <br />
        <Link
          href={"/login"}
          className="py-2 px-6 bg-neutral-200 text-black hover:bg-neutral-400 rounded-xl text-md"
        >
          Log in
        </Link>
      </div>
    );
  }

  return (
    <>
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold text-center mb-6">
          Blog Pro Web App
        </h1>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="animate-spin text-primary w-12 h-12" />
          </div>
        ) : videos.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {videos.map((video) => (
              <div
                key={video._id}
                className="card bg-base-100 shadow-xl border border-gray-200"
              >
                <figure>
                  <Video
                    urlEndpoint={process.env.NEXTAUTH_URL}
                    src={video.videoUrl}
                    controls={video.controls}
                    width={video.transformation?.width}
                    height={video.transformation?.height}
                  />
                </figure>
                <div className="card-body">
                  <h2 className="card-title">{video.title}</h2>
                  <p>{video.description}</p>
                  <div className="card-actions justify-end">
                    <button className="btn btn-primary">Watch</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center text-gray-500">No videos available.</div>
        )}
      </div>
    </>
  );
}
