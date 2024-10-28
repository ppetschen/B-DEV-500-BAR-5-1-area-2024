import { test as base } from "@playwright/test";
import { BasePage } from "./pages/base.page";

// Declare the types of your fixtures.
type MyFixtures = {
    basePage: BasePage;
};

// Extend base test by providing "todoPage" and "settingsPage".
// This new "test" can be used in multiple test files, and each of them will get the fixtures.
export const test = base.extend<MyFixtures>({
    basePage: async ({ page }, use) => {
        await use(new BasePage(page));
    },
});
export { expect } from "@playwright/test";
