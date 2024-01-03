export function isNullOrUndefined(obj: any) {
  return obj === null || obj === undefined;
}

export function isNullOrUndefinedString(obj: string) {
  return isNullOrUndefined(obj) || obj.trim().length === 0;
}