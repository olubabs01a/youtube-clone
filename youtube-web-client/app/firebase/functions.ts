import { httpsCallable } from "firebase/functions";
import { Video } from "@/types";
import { functions } from ".";

const generateUploadUrl = httpsCallable(functions, "generateUploadUrl");
const getUserVideosFunction = httpsCallable(functions, "getUserVideos");
const getAllVideosFunction = httpsCallable(functions, "getAllVideos");

export async function uploadVideo(file: File) {
  const response: any = await generateUploadUrl({
    fileExtension: file.name.split(".").pop()
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

export async function getAllVideos() {
  const response = await getAllVideosFunction();
  return response.data as Video[];
}

export async function getUserVideos() {
  const response = await getUserVideosFunction();
  return response.data as Video[];
}
