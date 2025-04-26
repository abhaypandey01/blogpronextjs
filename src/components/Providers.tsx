"use client";

import {
    ImageKitAbortError,
    ImageKitInvalidRequestError,
    ImageKitServerError,
    ImageKitUploadNetworkError,
    upload,
} from "@imagekit/next";

/**
 * Authenticates and retrieves the necessary upload credentials from the server.
 */
export const authenticator = async () => {
    const response = await fetch("/api/imagekit-auth");
    if (!response.ok) {
        throw new Error("Failed to authenticate for upload");
    }
    const { signature, expire, token, publicKey } = await response.json();
    return { signature, expire, token, publicKey };
};

/**
 * Handles the file upload process to ImageKit.
 * @param file The file to upload.
 * @param setProgress A callback to update the upload progress.
 */
export const handleUpload = async (file: File, setProgress: (progress: number) => void) => {
    const { signature, expire, token, publicKey } = await authenticator();

    const uploadResponse = await upload({
        expire,
        token,
        signature,
        publicKey,
        file,
        fileName: file.name,
        onProgress: (event) => {
            setProgress((event.loaded / event.total) * 100);
        },
    });

    return uploadResponse; // Return the upload response (e.g., URL, thumbnail URL)
};

/**
 * Providers component (optional, if needed for other purposes).
 */
const Providers = ({ children }: { children: React.ReactNode }) => {
    return <>{children}</>;
};

export default Providers;