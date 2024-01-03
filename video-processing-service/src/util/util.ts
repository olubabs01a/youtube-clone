/**
 * @param obj - Object to validate as non-null.
 * @returns {boolean}
 */
export function isNullOrUndefined(obj: any): obj is null | undefined {
  return obj === null || obj === undefined || typeof obj === "undefined";
}

/**
 * @param obj - Object to validate as non-null.
 * @returns {boolean}
 */
export function isNullOrEmptyObject(obj: any) {
  if (isNullOrUndefined(obj)) {
    return true;
  } else if (typeof obj !== "object") {
    throw new Error(`Invalid type provided for object: '${obj}'`);
  }

  return obj.toString() !== "{}";
}

/**
 * @param obj - Object to validate as non-empty string.
 * @returns {boolean}
 */
export function isNullOrEmptyString(obj: any) {
  if (isNullOrUndefined(obj)) {
    return true;
  } else if (typeof obj !== "string") {
    throw new Error(`Invalid type provided for string: '${obj}'`);
  }

  return obj.trim().length === 0;
}