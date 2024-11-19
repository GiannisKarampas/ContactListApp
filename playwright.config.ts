import {defineConfig} from "@playwright/test";
import {SetupConfig} from "@utils/common/SetupConfig.utils";

SetupConfig.setPathForConfigFile();
console.log(`The config file to use: ${SetupConfig.getConfigFileName()}`)

export default defineConfig({
    testMatch: /.*.ts/,
    testDir: "./test",
    /* Run tests in files in parallel */
    fullyParallel: true,
    /* Fail the build on CI if you accidentally left test.only in the source code. */
    forbidOnly: !!process.env.CI,
    /* Retry on CI only */
    retries: process.env.CI ? 2 : 0,
    /* Opt out of parallel tests on CI. */
    workers: process.env.CI ? 4 : undefined,
    /* Reporter to use. See https://playwright.dev/docs/test-reporters */
    reporter: [
        [
            "allure-playwright",
            {
                detail: true,
                resultsDir: "./test-results/allure-results",
                suiteTitle: false,
                categories: [
                    {
                        name: "Infrastracture problems",
                        matchedStatuses: ["broken"],
                    },
                    {
                        name: "Outdated tests",
                        messageRegex: ".*FileNotFound.*",
                    },
                    {
                        name: "Passed",
                        matchedStatuses: ["passed"],
                    },
                    {
                        name: "Ignored tests",
                        matchedStatuses: ["skipped"],
                    },
                ],
            },
        ],
    ],
    /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
    use: {
        testIdAttribute: "data-qtip",
        actionTimeout: 30 * 1000,
        navigationTimeout: 120 * 1000,
        /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
        trace: "on-first-retry",

        // To overlap issues with API calls
        ignoreHTTPSErrors: true,
        // Allow to read the clipboard
        permissions: ["clipboard-read"],
        headless: false,
        viewport: null,
        launchOptions: {
            args: ["--start-maximized"],
        },
    },

    /* Configure projects for major browsers */
    projects: [
        {
            name: "GUI Test",
            testDir: "./test/gui",
            testMatch: /.test.ts/,
            use: {
                baseURL: "https://thinking-tester-contact-list.herokuapp.com/"
            },
        },
    ],
});
