export type ProcessStatus = "processing" | "completed" | "error";

export interface Video {
  id?: string,
  uid?: string,
  filename?: string,
  status?: ProcessStatus,
  title?: string,
  description?: string,
  retryCount?: number
}