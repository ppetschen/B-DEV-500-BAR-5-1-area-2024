import { expect } from "@playwright/test";
import { BasePage } from "../fixtures/pages/base.page";
import { test } from "../fixtures/fixtures";

test.beforeEach(async ({ page }) => {
    await page.goto("/");
});

test("Base page ~ Basic display", async ({ basePage }) => {
    await basePage.visit();
    await expect(basePage.title(), "title to be visible").toBeVisible();
    await expect(
        basePage.loginButton(),
        "login button to be visible"
    ).toBeVisible();
    await expect(
        basePage.getsStartedButton(),
        "get started button to be visible"
    ).toBeVisible();
});

test.describe("Base page ~ Navigations", () => {
    test("Clicking on get started button", async ({ basePage }) => {
        await basePage.visit();
        await basePage.getsStartedButton().click();
        await expect(
            basePage.getsStartedButton(),
            "get started button to be hidden"
        ).not.toBeVisible();
        expect(basePage.page.url()).toContain("/signup");
    });
    test("Clicking on login button", async ({ basePage }) => {
        await basePage.visit();
        await basePage.loginButton().click();
        await expect(
            basePage.loginButton(),
            "login button to be hidden"
        ).not.toBeVisible();
        expect(basePage.page.url()).toContain("/login");
    });
});
