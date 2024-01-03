import { isNullOrEmptyString } from "../util/util";

export interface Config {
  isCloudEnabled: boolean;
  enableRequesterPays: boolean;
  rawVideoBucketName: string;
  processedVideoBucketName: string;
  localRawVideoPath: string;
  localProcessedVideoPath: string;
  gcpProjectId: string;
}

let config: Config = require("./configuration/config.json");

/**
 * Loads and validates local and environment configuration variables provided.
 * @returns {Config} A configuration object
 */
export function loadConfiguration(): Config {
  let validationErrors: string[] = [];

  if (isNullOrEmptyString(process.env.localRawVideoPath || config.localRawVideoPath)) {
    validationErrors.push("localRawVideoPath");
  } else if (isNullOrEmptyString(process.env.localRawVideoPath) === false) {
    config.localRawVideoPath = process.env.localRawVideoPath;
  }

  if (isNullOrEmptyString(process.env.localProcessedVideoPath || config.localProcessedVideoPath)) {
    validationErrors.push("localProcessedVideoPath");
  } else if (isNullOrEmptyString(process.env.localProcessedVideoPath) === false) {
    config.localProcessedVideoPath = process.env.localProcessedVideoPath;
  }

  if (isNullOrEmptyString(process.env.rawVideoBucketName || config.rawVideoBucketName)) {
    validationErrors.push("rawVideoBucketName");
  } else if (isNullOrEmptyString(process.env.rawVideoBucketName) === false) {
    config.rawVideoBucketName = process.env.rawVideoBucketName;
  }

  if (isNullOrEmptyString(process.env.processedVideoBucketName || config.processedVideoBucketName)) {
    validationErrors.push("processedVideoBucketName");
  } else if (isNullOrEmptyString(process.env.processedVideoBucketName) === false) {
    config.processedVideoBucketName = process.env.processedVideoBucketName;
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
      console.log(`Cloud enabled status is set to '${config.isCloudEnabled}'.`);
      break;
  }

  // Throw error if any validation errors recorded.
  if (validationErrors.length > 0) {
    const missingValues = `${validationErrors.map(e => `'${e}'`).join()}`;
    const errorMessage = `Missing configuration values for: ${missingValues}`;

    console.error(errorMessage);
    throw new Error(errorMessage);
  }

  return config;
}