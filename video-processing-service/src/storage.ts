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