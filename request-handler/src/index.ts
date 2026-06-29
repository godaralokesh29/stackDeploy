import dotenv from "dotenv";
dotenv.config();

import express from "express";
import {
  S3Client,
  GetObjectCommand,
} from "@aws-sdk/client-s3";

const app = express();

const s3 = new S3Client({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

app.get("/*", async (req, res) => {
  try {
    // Example:
    // 2eQTw.localhost
    // 2eQTw.stackdeploy.onthewifi.com

    const host = req.hostname;
    const id = host.split(".")[0];

    // "/" -> "/index.html"
    const filePath =
      req.path === "/" ? "/index.html" : req.path;

    const { Body } = await s3.send(
      new GetObjectCommand({
        Bucket: "stackdeploy-gitstore",
        Key: `dist/${id}${filePath}`,
      })
    );

    if (!Body) {
      return res.status(404).send("File not found");
    }

    const stream = Body as NodeJS.ReadableStream;

    if (filePath.endsWith(".html")) {
      res.setHeader("Content-Type", "text/html");
    } else if (filePath.endsWith(".css")) {
      res.setHeader("Content-Type", "text/css");
    } else if (filePath.endsWith(".js")) {
      res.setHeader("Content-Type", "application/javascript");
    } else if (filePath.endsWith(".png")) {
      res.setHeader("Content-Type", "image/png");
    } else if (filePath.endsWith(".svg")) {
      res.setHeader("Content-Type", "image/svg+xml");
    }

    stream.pipe(res);
  } catch (err) {
    console.error(err);
    res.status(404).send("Not Found");
  }
});

app.listen(3001, () => {
  console.log("Request Handler running on port 3001");
});