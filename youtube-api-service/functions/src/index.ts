import * as functions from "firebase-functions";
import * as firebase from "firebase-admin";
import {Storage} from "@google-cloud/storage";
import {onCall} from "firebase-functions/v2/https";
import {loadConfiguration} from "@configuration";

firebase.initializeApp();

const config = loadConfiguration();
const firestore = new firebase.firestore.Firestore();
const storage = new Storage();

export const createUser = functions.auth.user().onCreate((user) => {
  const userInfo = {
    uid: user.uid,
    email: user.email,
    photoUrl: user.photoURL,
  };

  firestore.collection(config.userCollectionId).doc(user.uid).set(userInfo);
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
  const bucket = storage.bucket(config.rawVideoBucketName);

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

export const getUserVideos = onCall({maxInstances: 1}, async (request) => {
  // Check if user is authenticated.
  if (request.auth === undefined) {
    throw new functions.https.HttpsError(
      "failed-precondition",
      "The function must be called while authenticated.",
    );
  }

  const querySnapshot =
    await firestore
      .collection(config.videoCollectionId)
      .where("uid", "==", request.auth.uid).get();

  return querySnapshot.docs.map((doc) => doc.data());
});

export const getAllVideos = onCall({maxInstances: 1}, async () => {
  const querySnapshot =
    await firestore.collection(config.videoCollectionId).limit(10).get();
  return querySnapshot.docs.map((doc) => doc.data());
});

export const getUploaderName = onCall({maxInstances: 1}, async (request) => {
  const name = 
    await firestore.collection(config.userCollectionId)
    .where("uid", "==", request.data.uid).limit(1).select("uname").get();
  return name.docs[0].data();
});