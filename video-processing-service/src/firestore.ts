import { loadConfiguration } from "./configuration";
import { credential } from "firebase-admin";
import { initializeApp } from "firebase-admin/app";
import { FieldValue, Firestore } from "firebase-admin/firestore";

initializeApp({ credential: credential.applicationDefault() });

const firestore = new Firestore();

// Note: This requires setting an env variable in Cloud Run
/** if (process.env.NODE_ENV !== "production") {
  firestore.settings({
      host: "localhost:8080", // Default port for Firestore emulator
      ssl: false
  });
} */

const config = loadConfiguration();

type ProcessStatus = "processing" | "completed" | "error";

export interface Video {
  id?: string,
  uid?: string,
  filename?: string,
  status?: ProcessStatus,
  title?: string,
  description?: string,
  retryCount?: number
}

async function getVideo(videoId: string) {
  const snapshot = await firestore.collection(config.videoCollectionId).doc(videoId).get();
  return (snapshot.data() as Video) ?? {};
}

export function setVideo(videoId: string, video: Video) {
  return firestore
    .collection(config.videoCollectionId)
    .doc(videoId)
    .set(video, { merge: true });
}

export async function isVideoNew(videoId: string) {
  const video = await getVideo(videoId);
  return video?.status === undefined;
}

export async function isRetry(videoId: string) {
  const video = await getVideo(videoId);
  return video?.retryCount ?? 0 > 0;
}

export async function updateRetryCount(videoId: string) {
  return firestore
    .collection(config.videoCollectionId)
    .doc(videoId)
    .update("retryCount", FieldValue.increment(1));
}

export async function hasReachedMaxRetryCount(videoId: string) {
  const video = await getVideo(videoId);
  return video?.retryCount ?? 0 >= config.maxRetryCount;
}
