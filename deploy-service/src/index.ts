import { createClient } from "redis";

const subscriber = createClient();

async function main() {
    await subscriber.connect();

    while (true) {
        const res = await subscriber.brPop("build-queue", 0);

        if (!res) continue;

        console.log(res.element);
    }
}

main();