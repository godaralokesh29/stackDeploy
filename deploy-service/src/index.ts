import { createClient } from "redis";
import { downloadS3Folder } from "./aws";
import { buildProject } from "./utils";

const subscriber = createClient();

async function main() {
    await subscriber.connect();

    while (true) {
        const res = await subscriber.brPop("build-queue", 0);
        console.log("Redis:", res);

        if (!res) continue;

        await downloadS3Folder(`${res.element}`)
        await buildProject(res.element);
    }
}

main();