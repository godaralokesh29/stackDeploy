import dotenv from "dotenv";
dotenv.config();

import {
  S3Client,
  ListObjectsV2Command,
  GetObjectCommand,
} from "@aws-sdk/client-s3";

import fs from "fs";
import path from "path";
import { pipeline } from "stream/promises";

const s3 = new S3Client({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export async function downloadS3Folder(prefix: string) {
  const { Contents } = await s3.send(
    new ListObjectsV2Command({
      Bucket: "stackdeploy-gitstore",
      Prefix: prefix,
    })
  );

  const promises =
    Contents?.map(async ({ Key }) => {
      if (!Key) return;

      const finalOutputPath = path.join(__dirname,`output/${Key}`);

      const dirName = path.dirname(finalOutputPath);

      if (!fs.existsSync(dirName)) {
        fs.mkdirSync(dirName, { recursive: true });
      }

      const { Body } = await s3.send(
        new GetObjectCommand({
          Bucket: "stackdeploy-gitstore",
          Key,
        })
      );

      if (!Body) return;

      await pipeline(
        Body as NodeJS.ReadableStream,
        fs.createWriteStream(finalOutputPath)
      );
    }) ?? [];

  console.log("awaiting");

  await Promise.all(promises);
}