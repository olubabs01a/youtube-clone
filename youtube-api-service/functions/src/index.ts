import * as functions from "firebase-functions";
import * as firebase from "firebase-admin";

firebase.initializeApp();

const firestore = new firebase.firestore.Firestore();

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
