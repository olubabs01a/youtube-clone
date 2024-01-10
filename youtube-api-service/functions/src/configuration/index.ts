export interface Config {
  userCollectionId: string;
  videoCollectionId: string;
  rawVideoBucketName: string;
  gcpProjectId: string;
}

import config = require("./config.json");

/**
 * Loads and validates local and environment configuration variables provided.
 * @return {Config} A configuration object
 */
export function loadConfiguration(): Config {
  const validationErrors: string[] = [];

  if (!config.gcpProjectId) {
    validationErrors.push("gcpProjectId");
  }

  if (!config.userCollectionId) {
    validationErrors.push("userCollectionId");
  }

  if (!config.videoCollectionId) {
    validationErrors.push("videoCollectionId");
  }

  if (!config.rawVideoBucketName) {
    validationErrors.push("rawVideoBucketName");
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
