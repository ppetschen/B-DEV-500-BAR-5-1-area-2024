/*
 ** EPITECH PROJECT, 2024
 ** safeArea
 ** File description:
 ** base.page ~test fixture
 ** Components for base page object
 */

import { Page } from "@playwright/test";

export class BasePage {
    page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    //^ Locators
    title = () => this.page.getByRole("heading", { name: "WELCOME TO AREA" });
    loginButton = () => this.page.getByRole('button', { name: 'Log in' })
    getsStartedButton = () => this.page.getByRole("button", { name: "Get started for free" });

    //^ Functions
    async visit() {
        await this.page.goto("/");
    }
}
