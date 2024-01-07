import * as functions from "firebase-functions";
import * as firebase from "firebase-admin";
import {Storage} from "@google-cloud/storage";
import {onCall} from "firebase-functions/v2/https";

firebase.initializeApp();

const firestore = new firebase.firestore.Firestore();
const storage = new Storage();

export const createUser = functions.auth.user().onCreate((user) => {
  const userInfo = {
    uid: user.uid,
    email: user.email,
    photoUrl: user.photoURL,
  };

  firestore.collection("users").doc(user.uid).set(userInfo);
  functions.logger.info(`User created: ${JSON.stringify(userInfo)}`);
  return;
});

export const generateUploadUrl = onCall({maxInstances: 1}, async (request) => {
  // Check if user is authenticated.
  if (request.auth === undefined) {
    throw new functions.https.HttpsError(
      "failed-precondition",
      "The function must be called while authenticated.",
    );
  }

  const auth = request.auth;
  const data = request.data;
  const bucket = storage.bucket("en1-yt-raw-vid3os");

  // Generate a unique filename for upload
  const fileName = `${auth.uid}-${Date.now()}.${data.fileExtension}`;

  // Get a v4 signed URL for uploading file
  const expires = Date.now() + 15 * 60 * 1000; // 15 minutes
  const [url] = await bucket.file(fileName).getSignedUrl({
    version: "v4",
    action: "write",
    expires,
  });

  return {url, fileName, expires};
});
