export interface Config {
  isCloudEnabled: boolean;
  enableRequesterPays: boolean;
  rawVideoBucketName: string;
  processedVideoBucketName: string;
  localRawVideoPath: string;
  localProcessedVideoPath: string;
  gcpProjectId: string;
}