/*
 ** EPITECH PROJECT, 2024
 ** safeArea
 ** File description:
 ** signup.page ~ test fixture
 */

import { Page } from "@playwright/test";

export class SignupPage {
    page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    //^ Locators
    title = () => this.page.getByRole("heading", { name: "Welcome!" });

    //* Inputs
    emailInput = () => this.page.getByRole("textbox", { name: "Email" });
    passwordInput = () =>
        this.page.getByRole("textbox", { name: "Password" }).first();
    confirmPasswordInput = () =>
        this.page.getByRole("textbox", { name: "Confirm password" });

    //* Input labels
    emailInputLabel = () => this.page.getByText("Email", { exact: true });
    passwordInputLabel = () => this.page.getByText("Password", { exact: true });
    confirmPasswordInputLabel = () =>
        this.page.getByText("Confirm password", { exact: true });

    //* Buttons
    githubButton = () => this.page.getByRole("button", { name: "GitHub" });
    googleButton = () => this.page.getByRole("button", { name: "Google" });

    //^ Functions
    async visit() {
        await this.page.goto("/signup");
    }
}
