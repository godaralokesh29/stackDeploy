import { createClient } from "redis";
import { downloadS3folder } from "./aws";

const subscriber = createClient();

async function main() {
    await subscriber.connect();

    while (true) {
        const res = await subscriber.brPop("build-queue", 0);

        if (!res) continue;

        await downloadS3folder(`${res.element}`)
    }
}

main();