import express from "express";
import { isNullOrEmptyString } from "./util";
import { convertVideo, deleteProcessedVideo, deleteRawVideo, downloadRawVideo, setupDirectories, uploadProcessedVideo } from "./storage";
import { ReasonPhrases, StatusCodes } from "http-status-codes";
import { loadConfiguration } from "./configuration";
import { hasReachedMaxRetryCount, isRetry, isVideoNew, setVideo, updateRetryCount } from "./firestore";

const config = loadConfiguration();
setupDirectories();

// Specify JSON request body
const app = express();
app.use(express.json());

app.post("/process-video", async (req, res) => {
  // Get the bucket and filename from the Cloud Pub/Sub message
  let data;

  try {
    const message = Buffer.from(req.body.message.data, "base64").toString("utf8").trim();
    data = JSON.parse(message);

    if (isNullOrEmptyString(data.name)) {
      throw new Error("Invalid message payload received.");
    }
  } catch (error) {
    console.error(error);
    return res.status(StatusCodes.BAD_REQUEST).send(`${ReasonPhrases.BAD_REQUEST}: missing file name.`);
  }

  const inputFileName = data.name; // In format of <UID>-<DATE>.<EXTENSION>
  const outputFileName = `processed-${inputFileName}`;
  const videoId = inputFileName.split(".")[0];

  if (await isVideoNew(videoId) === false) {
    if (await isRetry(videoId) === false) {
      return res.status(StatusCodes.BAD_REQUEST).send(`${ReasonPhrases.BAD_REQUEST}: video already processing or processed.`);
    }
  } else {
    await setVideo(videoId, {
      id: videoId,
      uid: videoId.split("-")[0],
      status: "processing"
    });
  }

  // Download raw video from Cloud Storage
  if (config.isCloudEnabled) {
    await downloadRawVideo(inputFileName);
  }

  try {
    // Convert the video to 360p
    await convertVideo(inputFileName, outputFileName);

    // Upload the processed video to Cloud Storage
    if (config.isCloudEnabled) {
      await uploadProcessedVideo(outputFileName);
    }

    await setVideo(videoId, {
      status: "completed",
      filename: outputFileName
    });
  } catch (err) {
    console.error(err);

    if (await hasReachedMaxRetryCount(videoId)) {
      await setVideo(videoId, {
        id: videoId,
        uid: videoId.split("-")[0],
        status: "error"
      });
    } else {
      await updateRetryCount(videoId);
    }

    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(`${ReasonPhrases.INTERNAL_SERVER_ERROR}: Video Processing failed.`);
  } finally {
    // Cleanup working directories.
    await Promise.all([
      deleteRawVideo(inputFileName),
      deleteProcessedVideo(outputFileName)
    ]);
  }

  return res.status(StatusCodes.OK).send();
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
