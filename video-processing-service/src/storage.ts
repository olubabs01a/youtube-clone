import { Storage } from "@google-cloud/storage";
import fs from "fs";
import ffmpegStatic from "ffmpeg-static";
import ffmpeg from "fluent-ffmpeg";
import { loadConfiguration } from "./configuration";
import { isNullOrEmptyString, isNullOrUndefined } from "./util";

// Import configuration
const config = loadConfiguration();
const localRawVideoPath = config.localRawVideoPath;
const localProcessedVideoPath = config.localProcessedVideoPath;
const rawVideoBucketName = config.rawVideoBucketName;
const processedVideoBucketName = config.processedVideoBucketName;

// Setup ffmpeg
// Tell fluent-ffmpeg where it can find FFmpeg
if (isNullOrEmptyString(ffmpegStatic) === false) {
  ffmpeg.setFfmpegPath(ffmpegStatic);
}

// Creates a client
const storage = new Storage();

/**
 * Creates directories for raw and processed videos
 */
export function setupDirectories() {
  ensureDirectoryExistence(localRawVideoPath);
  ensureDirectoryExistence(localProcessedVideoPath);

  // Setup bucket if cloud is enabled
  if (config.isCloudEnabled) {
    ensureBucketExistence(rawVideoBucketName);
    ensureBucketExistence(processedVideoBucketName);
  }
}

/**
 * Ensures a bucket exists, creating it if necessary.
 * @param {string} bucketName - THe name of the bucket to check.
 */
async function ensureBucketExistence(bucketName: string) {
  try {
    if (await storage.bucket(bucketName).exists()) {
      console.log(`Bucket named '${bucketName}' found`);
    } else {
      console.log(`Bucket named '${bucketName}' not found. Creating now...`);
      await storage.createBucket(bucketName);
    }
  } catch (err) {
    console.error(err);
    throw err;
  }
}

/**
 * Ensures a directory exists, creating it if necessary.
 * @param {string} dirPath - The directory path to check.
 */
function ensureDirectoryExistence(dirPath: string) {
  if (fs.existsSync(dirPath) === false) {
    fs.mkdirSync(dirPath, { recursive: true });
    console.log(`Directory created at '${dirPath}'.`);
  }
}

/**
 * Convert provided raw video and save as provided processed file name.
 * @param {string} rawVideoName - The name of the file to convert from {@link localRawVideoPath}
 * @param {string} processedVideoName - The name of the file to convert to {@link localProcessedVideoPath}
 * @returns A promise that resolves when the video has been converted.
 */
export function convertVideo(rawVideoName: string, processedVideoName: string) {
  return new Promise<void>((resolve, reject) => {
    ffmpeg(`${localRawVideoPath}/${rawVideoName}`)
      .outputOptions("-vf", "scale=-1:360:force_divisible_by=2") // 360p
      .on("end", function () {
        console.info("Processing finished successfully");
        resolve();
      })
      .on("error", (err, stdout, stderr) => {
        console.error(`An error occurred: ${err.message}`);
        isNullOrEmptyString(stdout) === false && console.log(`stdout:\n${stdout}`);
        isNullOrEmptyString(stderr) === false && console.log(`stderr:\n${stderr}`);

        reject(err);
      })
      .save(`${localProcessedVideoPath}/${processedVideoName}`);
  });
}

/**
 * @param {string} fileName - The name of the file to download from the
 * {@link rawVideoBucketName} bucket into the {@link localRawVideoPath} folder.
 * @returns A promise that resolves when the file has been downloaded.
 */
export async function downloadRawVideo(fileName: string) {
  await storage.bucket(rawVideoBucketName)
    .file(fileName)
    .download({ destination: `${localRawVideoPath}/${fileName}` });

  console.log(`'gs://${rawVideoBucketName}/${fileName}' downloaded to '${localRawVideoPath}/${fileName}'`
  );
}

/**
 * @param {string} fileName - The name of the file to download from the
 * {@link localProcessedVideoPath} folder into the bucket {@link processedVideoBucketName}.
 * @returns A promise that resolves when the file has been uploaded.
 */
export async function uploadProcessedVideo(fileName: string) {
  const bucket = storage.bucket(processedVideoBucketName);

  await bucket.upload(`${localProcessedVideoPath}/${fileName}`, { destination: fileName });

  await bucket.file(fileName).makePublic();

  console.log(`'${localRawVideoPath}/${fileName}' uploaded to 'gs://${processedVideoBucketName}/${fileName}'`
  );
}

/**
 * @param {string} fileName - The name of the file to delete from the
 * {@link localRawVideoPath} folder.
 * @returns A promise that resolves when the file has been deleted.
 */
export function deleteRawVideo(fileName: string): Promise<void> {
  return deleteFile(`${localRawVideoPath}/${fileName}`);
}

/**
 * @param {string} fileName - The name of the file to delete from the
 * {@link localProcessedVideoPath} folder.
 * @returns A promise that resolves when the file has been deleted.
 */
export function deleteProcessedVideo(fileName: string): Promise<void> {
  return deleteFile(`${localProcessedVideoPath}/${fileName}`);
}

/**
 * @param {string} filePath - The path of the file to delete.
 * @returns A promise that resolves when the file has been deleted.
 */
function deleteFile(filePath: string): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    if (fs.existsSync(filePath) === false) {
      reject(`File '${filePath}' does not exist.`);
    } else {
      fs.unlink(filePath, err => {
        if (err) {
          console.error(`Failed to delete file at '${filePath}'`, err);
          reject(err);
        } else {
          console.log(`File deleted at '${filePath}'`);
          resolve();
        }
      });
    }
  });
}