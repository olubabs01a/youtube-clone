import { Storage } from "@google-cloud/storage";
import fs from "fs";
import ffmpeg from "fluent-ffmpeg";

// Creates a client
const storage = new Storage();

/**
 * Creates local directories for raw and processed videos
 */
export function setupDirectories() {

}

/**
 * Convert provided raw video and save as provided processed file name.
 * @param rawVideoName - The name of the file to convert from {@link localRawVideoPath}
 * @param processedVideoName - The name of the file to convert to {@link localProcessedVideoPath}
 * @returns A promise that resolves when the video has been converted.
 */
export function convertVideo(rawVideoName: string, processedVideoName: string) {
    return new Promise<void>((resolve, reject) => {
        ffmpeg(`${localRawVideoPath}/${rawVideoName}`)
            .outputOptions("-vf", "scale=-1:360") // 360p
            .on("end", function () {
                console.info("Processing finished successfully");
                resolve();
            })
            .on("error", (err) => {
                console.error(`An error occurred: ${err.message}`);
                reject(err);
            })
            .save(`${processedVideoPath}/${processedVideoName}`);
    });
}

/**
 * @param fileName - The name of the file to download from the
 * {@link rawVideoBucketName} bucket into the {@link localRawVideoPath} folder.
 * @returns A promise that resolves when the file has been downloaded.
 */
export async function downloadRawVideo(fileName: string) {
    await storage.bucket(rawVideoBucketName)
        .file(fileName)
        .download({ destination: `${localRawVideoPath}/${fileName}` });

    console.log(`
        'gs://${rawVideoBucketName}/${fileName}' downloaded to '${localRawVideoPath}/${fileName}'`
    );
}

/**
 * @param fileName - The name of the file to download from the
 * {@link localProcessedVideoPath} folder into the bucket {@link processedVideoBucketName}.
 * @returns A promise that resolves when the file has been uploaded.
 */
export async function uploadProcessedVideo(fileName: string) {
    const bucket = storage.bucket(processedVideoBucketName);

    await bucket.upload(`${localProcessedVideoPath}/${fileName}`, { destination: fileName });

    await bucket.file(fileName).makePublic();

    console.log(`
        '${localRawVideoPath}/${fileName}' uploaded to 'gs://${processedVideoBucketName}/${fileName}'`
    );
}
