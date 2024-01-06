interface FirebaseConfig {
  apiKey: string;
  authDomain: string;
  appId: string;
  measurementId: string;
}

export interface Config {
  firebase: FirebaseConfig;
  gcpProjectId: string;
}

let config: Config = require("./config.json");

/**
 * Loads and validates local and environment configuration variables provided.
 * @returns {Config} A configuration object
 */
export function loadConfiguration(): Config {
  let validationErrors: string[] = [];

  if (config.gcpProjectId ?? "" === "" ) {
    validationErrors.push("gcpProjectId");
  }

  if (config.firebase.apiKey ?? "" === "" ) {
    validationErrors.push("firebase:apiKey");
  }

  if (config.firebase.authDomain ?? "" === "" ) {
    validationErrors.push("firebase:authDomain");
  }

  if (config.firebase.appId ?? "" === "" ) {
    validationErrors.push("firebase:appId");
  }

  if (config.firebase.measurementId ?? "" === "" ) {
    validationErrors.push("firebase:measurementId");
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