import express from "express";
import { isNullOrEmptyString } from "./util/util";
import { convertVideo, deleteProcessedVideo, deleteRawVideo, downloadRawVideo, uploadProcessedVideo } from "./storage";
import { ReasonPhrases, StatusCodes } from "http-status-codes";

const app = express();

// Specify JSON request body
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

  const inputFileName = data.name;
  const outputFileName = `processed-${inputFileName}`;

  // Download raw video from Cloud Storage
  await downloadRawVideo(inputFileName);

  try {
    // Convert the video to 360p
    await convertVideo(inputFileName, outputFileName);

    // Upload the processed video to Cloud Storage
    await uploadProcessedVideo(outputFileName);
  } catch (err) {
    console.error(err);
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
