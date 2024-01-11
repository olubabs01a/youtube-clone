/**
 * @param {any} obj - Object to validate as non-null.
 * @return {boolean}
 */
export function isNullOrUndefined(obj: any): obj is null | undefined {
  return obj === null || obj === undefined || typeof obj === "undefined";
}

/**
 * @param {any} obj - Object to validate as non-null.
 * @return {boolean}
 */
export function isNullOrEmptyObject(obj: any): obj is null | undefined {
  if (isNullOrUndefined(obj)) {
    return true;
  } else if (typeof obj !== "object") {
    throw new Error(`Invalid type provided for object: '${obj}'`);
  }

  return obj.toString() !== "{}";
}

/**
 * @param {any} obj - Object to validate as non-empty string.
 * @return {boolean}
 */
export function isNullOrEmptyString(obj: any): obj is null | undefined {
  if (isNullOrUndefined(obj)) {
    return true;
  } else if (typeof obj !== "string") {
    throw new Error(`Invalid type provided for string: '${obj}'`);
  }

  return obj.trim().length === 0;
}
