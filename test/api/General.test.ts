import {test} from "@fixtures/Fixtures";
import {expect} from "@playwright/test";
import * as dbDriver from "@main/utils/database/DBDriver";
import {config} from "mssql";
import * as process from "node:process";

test("Connect to mssql db", async ({}) => {
    let driver: dbDriver.SQLServerDBDriver = new dbDriver.SQLServerDBDriver(dbConfig);

    let pool = await driver.connect();

    let query: string = "SELECT * FROM TABLE (  )"
    const result = await driver.read(query);

    expect(result).toBeTruthy();
})

const dbConfig: config = {
    user: process.env.SQL_SERVER_USERNAME,
    server: process.env.SQL_SERVER,
    database: process.env.DB,
    password: process.env.SQL_SERVER_PASSWORD,
    options: {
        encrypt: true
    }
}