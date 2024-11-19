import {mergeTests, test as base} from "@playwright/test";
import {test as LoginFixture} from "./Login.fixtures";
import {test as ContactFixture} from "./Contact.fixtures";
import {test as CreateUserFixture} from "./CreateUser.fixtures";

export const test = mergeTests(LoginFixture, ContactFixture, CreateUserFixture);
