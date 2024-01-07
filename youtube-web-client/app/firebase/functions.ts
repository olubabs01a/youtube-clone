import {getFunctions, httpsCallable} from "firebase/functions";
import { extname } from "path";

const functions = getFunctions();

const generateUploadUrl = httpsCallable(functions, "generateUplodUrl");

export async function uploadVideo(file: File) {
    const response: any = await generateUploadUrl({
        fileExtension: extname(file.name)
    });

    // Upload the file via signed URL
    await fetch(response?.data?.url, {
        method: "PUT",
        body: file,
        headers: {
            "Content-Type": file.type
        }
    });

    return;
}