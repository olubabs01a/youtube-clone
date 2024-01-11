interface FirebaseConfig {
  apiKey: string;
  authDomain: string;
  appId: string;
  measurementId: string;
}

export interface Config {
  firebase: FirebaseConfig;
  isCloudEnabled: boolean;
  enableRequesterPays: boolean;
  rawVideoBucketName: string;
  processedVideoBucketName: string;
  localRawVideoPath: string;
  localProcessedVideoPath: string;
  userCollectionId: string;
  videoCollectionId: string;
  maxRetryCount: number;
  gcpProjectId: string;
}

import config from "./config.json";

/**
 * Loads and validates local and environment configuration variables provided.
 * @return {Config} A configuration object
 */
export function loadConfiguration(): Config {
  const validationErrors: string[] = [];

  if (!config.localRawVideoPath) {
    validationErrors.push("localRawVideoPath");
  }

  if (!config.localProcessedVideoPath) {
    validationErrors.push("localProcessedVideoPath");
  }

  if (!config.rawVideoBucketName) {
    validationErrors.push("rawVideoBucketName");
  }

  if (!config.processedVideoBucketName) {
    validationErrors.push("processedVideoBucketName");
  }

  if (!config.firebase.apiKey) {
    validationErrors.push("firebase:apiKey");
  }

  if (!config.firebase.authDomain) {
    validationErrors.push("firebase:authDomain");
  }

  if (!config.firebase.appId) {
    validationErrors.push("firebase:appId");
  }

  if (!config.firebase.measurementId) {
    validationErrors.push("firebase:measurementId");
  }

  if (!config.userCollectionId) {
    validationErrors.push("userCollectionId");
  }

  if (!config.videoCollectionId) {
    validationErrors.push("videoCollectionId");
  }

  if (config.maxRetryCount <= 0) {
    config.maxRetryCount = 0;
    console.debug(`Maximum retry count is set to '${config.maxRetryCount}'.`);
  }

  switch (process.env.isCloudEnabled?.toLowerCase() || "") {
    case "true":
    case "1":
      config.isCloudEnabled = true;
      break;

    case "false":
    case "0":
      config.isCloudEnabled = false;
      break;

    default:
      console.debug(
        `Cloud enabled status is set to '${config.isCloudEnabled}'.`
      );
      break;
  }

  // Throw error if any validation errors recorded.
  if (validationErrors.length > 0) {
    const missingValues = `${validationErrors.map((e) => `'${e}'`).join()}`;
    const errorMessage = `Missing configuration values for: ${missingValues}`;

    console.error(errorMessage);
    throw new Error(errorMessage);
  }

  return config;
}
