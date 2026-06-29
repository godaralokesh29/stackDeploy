import { exec, spawn } from "child_process";
import dotenv from "dotenv";
dotenv.config();

import fs from "fs";
import path from "path";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

const s3 = new S3Client({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});


export function buildProject(id: string) {
    return new Promise((resolve) => {
        const child = exec(`cd ${path.join(__dirname, `output/${id}`)} && npm install && npm run build`)

        child.stdout?.on('data', function(data) {
            console.log('stdout: ' + data);
        });
        child.stderr?.on('data', function(data) {
            console.log('stderr: ' + data);
        });

        child.on('close', function(code) {
           resolve("")
        }); 

    })
}



export async function copyFinalBuild(id: string) {
  const folderPath = path.join(__dirname, `output/${id}/dist`);

  const allFiles = getAllFiles(folderPath);

  await Promise.all(
    allFiles.map((file) =>
      uploadFile(`dist/${id}/${file.slice(folderPath.length + 1)}`, file)
    )
  );

  console.log("Build uploaded successfully!");
}

function getAllFiles(folderPath: string): string[] {
  let response: string[] = [];

  const allFilesAndFolders = fs.readdirSync(folderPath);

  allFilesAndFolders.forEach((file) => {
    const fullFilePath = path.join(folderPath, file);

    if (fs.statSync(fullFilePath).isDirectory()) {
      response = response.concat(getAllFiles(fullFilePath));
    } else {
      response.push(fullFilePath);
    }
  });

  return response;
}

async function uploadFile(fileName: string, localFilePath: string) {
  const fileContent = fs.readFileSync(localFilePath);

  await s3.send(
    new PutObjectCommand({
      Bucket: "stackdeploy-gitstore",
      Key: fileName,
      Body: fileContent,
    })
  );

  console.log(`Uploaded: ${fileName}`);
}