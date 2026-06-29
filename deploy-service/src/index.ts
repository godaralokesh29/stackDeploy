import { createClient } from "redis";
import { downloadS3Folder } from "./aws";
import { buildProject, copyFinalBuild } from "./utils";

const subscriber = createClient();
const publisher = createClient();

async function main() {
  await subscriber.connect();
  await publisher.connect();

  while (true) {
    const res = await subscriber.brPop("build-queue", 0);

    console.log("Redis:", res);

    if (!res) continue;

    const id = res.element;

    await downloadS3Folder(id);
    await buildProject(id);
    await copyFinalBuild(id);

    await publisher.hSet("status", id, "deployed");

    console.log(`Deployment ${id} completed.`);
  }
}

main().catch(console.error);