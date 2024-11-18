/**
 * In this file, are imported all the fixtures file to be combined and be used all of them in the tests.
 */

import {mergeTests} from "@playwright/test";
import {test as CommonFixtures} from "./Common.fixture";
import {test as PagesFixtures} from "./Pages.fixture";
import {test as FilesHandlingFixtures} from "./FilesHandling.fixture";

export const test = mergeTests(CommonFixtures, PagesFixtures, FilesHandlingFixtures);
