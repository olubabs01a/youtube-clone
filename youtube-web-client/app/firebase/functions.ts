import { httpsCallable } from "firebase/functions";
import { functions } from ".";

const generateUploadUrl = httpsCallable(functions, "generateUploadUrl");
const getUserVideosFunction = httpsCallable(functions, "getUserVideos");
const getAllVideosFunction = httpsCallable(functions, "getAllVideos");

export async function uploadVideo(file: File) {
  const response: any = await generateUploadUrl({
    fileExtension: file.name.split('.').pop()
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

type ProcessStatus = "processing" | "completed" | "error";

interface Video {
  id?: string,
  uid?: string,
  filename?: string,
  status?: ProcessStatus,
  title?: string,
  description?: string
}

export async function getAllVideos() {
  const response = await getAllVideosFunction();
  return response.data as Video[];
}

export async function getUserVideos() {
  const response = await getUserVideosFunction();
  return response.data as Video[];
}
