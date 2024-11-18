import {defineConfig, devices} from "@playwright/test";
import {SetupConfig} from "./utils/common/setupConfig.utils";

SetupConfig.setPathForConfigFile();

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
// require('dotenv').config();

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
    testMatch: /.*.ts/,
    testDir: "./testcases",
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
        ["html", {open: "never"}],
        ["junit", {outputFile: "./test-results/xml-reporter/test-results.xml"}],
        ["json", {outputFile: "./test-results/json-reporter/test-results.json"}],
        [
            "allure-playwright",
            {
                detail: true,
                outputFolder: "./test-results/allure-results",
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
        /* Base URL to use in actions like `await page.goto('/')`. */
        // baseURL: 'http://127.0.0.1:3000',

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
            name: "Test",
            testDir: "./testcases/",
            testMatch: /.test.ts/,
            use: {},
        },
        // {
        //   name: 'chromium',
        //   use: { ...devices['Desktop Chrome'] },
        // },

        // {
        //   name: 'firefox',
        //   use: { ...devices['Desktop Firefox'] },
        // },

        // {
        //   name: 'webkit',
        //   use: { ...devices['Desktop Safari'] },
        // },

        /* Test against mobile viewports. */
        // {
        //   name: 'Mobile Chrome',
        //   use: { ...devices['Pixel 5'] },
        // },
        // {
        //   name: 'Mobile Safari',
        //   use: { ...devices['iPhone 12'] },
        // },

        /* Test against branded browsers. */
        // {
        //   name: 'Microsoft Edge',
        //   use: { ...devices['Desktop Edge'], channel: 'msedge' },
        // },
        // {
        //   name: 'Google Chrome',
        //   use: { ...devices['Desktop Chrome'], channel: 'chrome' },
        // },
    ],

    /* Run your local dev server before starting the tests */
    // webServer: {
    //   command: 'npm run start',
    //   url: 'http://127.0.0.1:3000',
    //   reuseExistingServer: !process.env.CI,
    // },
});
