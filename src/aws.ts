import dotenv from "dotenv";
dotenv.config();
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import fs from "fs";

const s3 = new S3Client({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export const uploadFile = async (
  fileName: string,
  localFilePath: string
) => {
  const fileContent = fs.readFileSync(localFilePath);

  const response = await s3.send(
    new PutObjectCommand({
      Bucket: "stackdeploy-gitstore",
      Key: fileName,
      Body: fileContent,
    })
  );

  return response;
};