"use client";

import React, { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { useNotification, NotificationProvider } from "@/components/Notification";
import { handleUpload } from "@/components/Providers";
import { Loader2 } from "lucide-react";
import { apiClient } from "@/lib/api-client";

interface VideoFormInputs {
  title: string;
  description: string;
  file: FileList;
}

function VideoUploadForm() {
  const { register, handleSubmit, reset, formState: { errors } } = useForm<VideoFormInputs>();
  const { showNotification } = useNotification();
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const onSubmit: SubmitHandler<VideoFormInputs> = async (data) => {
    if (!data.file || data.file.length === 0) {
      showNotification("Please select a video file to upload.", "error");
      return;
    }

    setIsUploading(true);

    try {
      // Use the handleUpload function to upload the file
      const file = data.file[0];
      const uploadResponse = await handleUpload(file, setProgress);

      // Assuming the upload response contains the video URL and thumbnail URL
      const { url, thumbnailUrl } = uploadResponse;

      // Save video metadata to the database using the apiClient
      const videoData = {
        title: data.title,
        description: data.description,
        videoUrl: url,
        thumbnailUrl,
      };

      await apiClient.createVideo({
        title: data.title,
        description: data.description,
        videoUrl: url, // Ensure this is not undefined
        thumbnailUrl: "", // Ensure this is not undefined
      }); // Use apiClient to create the video

      showNotification("Video uploaded successfully!", "success");
      reset(); // Reset the form
    } catch (error) {
      console.error("Error uploading video:", error);
      showNotification("Failed to upload video.", "error");
    } finally {
      setIsUploading(false);
      setProgress(0);
    }
  };

  return (
    <div className="min-h-screen w-full bg-gray-900 text-center flex flex-col justify-center items-center">
      <h2 className="text-2xl font-extrabold mb-10 text-white">Upload Video</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 w-1/3 bg-gray-800 p-6 rounded-lg shadow-lg">
        <div>
          <label htmlFor="title" className="block mb-1 text-white">
            Title
          </label>
          <input
            type="text"
            id="title"
            {...register("title", { required: "Title is required" })}
            className="w-full px-3 py-2 border rounded bg-gray-700 text-white"
          />
          {errors.title && <p className="text-red-500 text-sm">{errors.title.message}</p>}
        </div>
        <div>
          <label htmlFor="description" className="block mb-1 text-white">
            Description
          </label>
          <textarea
            id="description"
            {...register("description", { required: "Description is required" })}
            className="w-full px-3 py-2 border rounded bg-gray-700 text-white"
          />
          {errors.description && <p className="text-red-500 text-sm">{errors.description.message}</p>}
        </div>
        <div>
          <label htmlFor="file" className="block mb-1 text-white">
            Video File
          </label>
          <input
            type="file"
            id="file"
            accept="video/*"
            {...register("file", { required: "Video file is required" })}
            className="w-full px-3 py-2 border rounded bg-gray-700 text-white"
          />
          {errors.file && <p className="text-red-500 text-sm">{errors.file.message}</p>}
        </div>
        <button
          type="submit"
          className="w-full bg-white text-black py-2 rounded hover:bg-gray-400 flex items-center justify-center"
          disabled={isUploading}
        >
          {isUploading ? (
            <>
              <Loader2 className="animate-spin mr-2" />
              Uploading...
            </>
          ) : (
            "Upload"
          )}
        </button>
        {isUploading && (
          <div className="mt-4">
            <progress value={progress} max={100} className="w-full"></progress>
            <p className="text-white mt-2">{Math.round(progress)}% uploaded</p>
          </div>
        )}
      </form>
    </div>
  );
}

export default function VideoUploadPage() {
  return (
    <NotificationProvider>
      <VideoUploadForm />
    </NotificationProvider>
  );
}