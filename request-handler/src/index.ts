import dotenv from "dotenv";
dotenv.config();

import express from "express";
import { Readable } from "stream";
import { S3Client, GetObjectCommand, ListObjectsV2Command } from "@aws-sdk/client-s3";

const BUCKET = "stackdeploy-gitstore";
const BASE_PREFIX = "dist/";

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

const app = express();

const streamToBuffer = async (
  body: Readable | Uint8Array | string | { getReader: () => any }
): Promise<Buffer> => {
  if (body instanceof Readable) {
    const chunks: Buffer[] = [];
    for await (const chunk of body) {
      chunks.push(typeof chunk === "string" ? Buffer.from(chunk) : Buffer.from(chunk));
    }
    return Buffer.concat(chunks);
  }

  if (typeof body === "string") {
    return Buffer.from(body);
  }

  if (typeof (body as any).getReader === "function") {
    const reader = (body as any).getReader();
    const chunks: Uint8Array[] = [];

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      if (value) {
        chunks.push(value);
      }
    }

    return Buffer.concat(chunks.map((chunk) => Buffer.from(chunk)));
  }

  return Buffer.from(body as Uint8Array);
};

const resolveFolderPrefix = async (id: string): Promise<string | undefined> => {
  if (!id) return undefined;

  const response = await s3.send(
    new ListObjectsV2Command({
      Bucket: BUCKET,
      Prefix: BASE_PREFIX,
      MaxKeys: 1000,
    })
  );

  const keys = response.Contents?.map((item) => item.Key ?? "") ?? [];
  const prefixes = new Set<string>();

  for (const key of keys) {
    if (!key.startsWith(BASE_PREFIX)) continue;
    const remainder = key.slice(BASE_PREFIX.length);
    const separatorIndex = remainder.search(/[\/]/);
    const folderName = separatorIndex === -1 ? remainder : remainder.slice(0, separatorIndex);
    if (folderName) {
      prefixes.add(folderName);
    }
  }

  const matching = [...prefixes].find((folderName) => folderName.toLowerCase() === id.toLowerCase());
  return matching ? `${BASE_PREFIX}${matching}/` : undefined;
};

app.get(/.*/, async (req, res) => {
  // id.127.0.0.1.nip.io
  const rawHost = req.get("host") || req.headers.host || req.hostname;
  const host = rawHost?.toString().split(":")[0] ?? "";
  const id = host.split(".")[0] ?? "";
  const filePath = req.path === "/" ? "/index.html" : req.path;
  const normalizedPath = filePath.replace(/\\/g, "/").replace(/^\//, "");
  const folderPrefix = (await resolveFolderPrefix(id)) ?? `${BASE_PREFIX}${id}/`;
  const normalizedFolderPrefix = folderPrefix.replace(/\\/g, "/");
  const backslashFolderPrefix = normalizedFolderPrefix.replace(/\//g, "\\");
  const possibleKeys = [
    `${normalizedFolderPrefix}${normalizedPath}`,
    `${normalizedFolderPrefix}${normalizedPath.replace(/\//g, "\\")}`,
    `${backslashFolderPrefix}${normalizedPath}`,
    `${backslashFolderPrefix}${normalizedPath.replace(/\//g, "\\")}`,
  ];

  console.log(`Resolved folderPrefix=${folderPrefix}`);
  console.log(`Requesting S3 object for keys=${possibleKeys.join(", ")}`);

  let lastError: unknown;
  for (const key of possibleKeys) {
    try {
      const response = await s3.send(
        new GetObjectCommand({
          Bucket: BUCKET,
          Key: key,
        })
      );

      if (response.Body) {
        const body = await streamToBuffer(response.Body as Readable | Uint8Array | string | { getReader: () => any });
        const type = filePath.endsWith(".html")
          ? "text/html"
          : filePath.endsWith(".css")
          ? "text/css"
          : filePath.endsWith(".js")
          ? "application/javascript"
          : filePath.endsWith(".svg")
          ? "image/svg+xml"
          : "application/octet-stream";

        return res.set("Content-Type", type).send(body);
      }
    } catch (error: unknown) {
      const err = error as { name?: string; message?: string };
      console.warn(`S3 miss for key=${key}:`, err.name ?? "Unknown", err.message ?? err);
      lastError = error;
      if (err.name !== "NoSuchKey") {
        console.error(`S3 request failed for key=${key}:`, err.name ?? "Unknown", err.message ?? err);
        return res.status(500).send("Internal server error");
      }
    }
  }

  console.error(`All S3 key attempts failed for id=${id}, path=${normalizedPath}`, lastError);
  return res.status(404).send("Not found");
});

app.listen(3001, () => {
  console.log("Request Handler running on port 3001");
});