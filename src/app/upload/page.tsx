'use client'

import VideoUploadPage from "@/components/VideoUploadForm";

function videoUpload() {
    return (
        <div className="text-center bg-gray-900 text-neutral-400">
        <div className="min-h-screen w-full flex justify-center items-center">
        <VideoUploadPage />
        </div>
        </div>
    );
}

export default videoUpload;
