import {logger} from "@main/GlobalSetup";

async function tearDown() {
    await clearDatabase();
}

async function clearDatabase() {
}

export default tearDown;
