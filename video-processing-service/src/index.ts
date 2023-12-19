import express from "express";
import ffmpeg from "fluent-ffmpeg";
import * as fs from "fs";

const app = express();

// Specify JSON request body
app.use(express.json());

app.post("/process-video", (req, res) => {
  // Get the path of the input video file from the request body
  const inputFilePath = req.body.inputFilePath;
  const outputFilePath = req.body.outputFilePath;

  // Check if the input file path is defined and exists
  const isMissingPath = !inputFilePath || !outputFilePath;
  const isInvalidInputPath = !fs.existsSync(inputFilePath);

  if (isMissingPath) {
    return res.status(400).send("Bad Request: Missing file path");
  } else if (isInvalidInputPath) {
    return res.status(400).send("Bad Request: Invalid input file path");
  }

  // Create the ffmpeg command
  ffmpeg(inputFilePath)
    .outputOptions("-vf", "scale=-1:360") // 360p
    .on("end", function () {
      console.info("Processing finished successfully");
      res.status(200).send("Processing finished successfully");
    })
    .on("error", function (err: any) {
      console.error("An error occurred: " + err.message);
      res.status(500).send("An error occurred: " + err.message);
    })
    .save(outputFilePath);
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
