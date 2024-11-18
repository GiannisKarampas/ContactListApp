import { test as base, createBdd } from 'playwright-bdd';
import { test as fixture } from "@fixtures/Fixtures";
import {mergeTests} from "@playwright/test";

export const test = mergeTests(base, fixture);
export const { Given, When, Then, BeforeAll, AfterAll, Before, After } = createBdd(test);