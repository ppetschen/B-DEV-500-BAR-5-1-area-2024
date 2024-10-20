/*
** EPITECH PROJECT, 2024
** safeArea
** File description:
** login.page ~ test fixture
*/

import { Page } from "@playwright/test";

export class LoginPage {
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
        await this.page.goto("/login");
    }
}
