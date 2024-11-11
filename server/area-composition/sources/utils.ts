import process from "node:process";
import { Octokit } from "@octokit/rest";
import { REST } from "@discordjs/rest";
import { Routes } from "discord-api-types/v10";
import { google } from "googleapis";

const HOSTS = {
  DATABASE: process.env["DATABASE_HOST"],
  ACTION: process.env["ACTION_HOST"],
  REACTION: process.env["REACTION_HOST"],
};

export const host = (key: keyof typeof HOSTS, path: string) =>
  `http://${HOSTS[key]}${path}`;

const getGitHubCompletions = async (
  accessToken: string,
): Promise<Record<string, unknown>> => {
  const octokit = new Octokit({ auth: accessToken });
  const data = await octokit.paginate(octokit.repos.listForAuthenticatedUser, {
    per_page: 100,
  });

  return {
    data: [
      ...data.map(({ owner, name }) => ({ owner: owner.login, repo: name })),
      ...[
        "branch_protection_configuration",
        "branch_protection_rule",
        "check_run",
        "check_suite",
        "code_scanning_alert",
        "commit_comment",
        "create",
        "custom_property",
        "custom_property_values",
        "delete",
        "dependabot_alert",
        "deploy_key",
        "deployment",
        "deployment_protection_rule",
        "deployment_review",
        "deployment_status",
        "discussion",
        "discussion_comment",
        "fork",
        "github_app_authorization",
        "gollum",
        "installation",
        "installation_repositories",
        "installation_target",
        "issue_comment",
        "issues",
        "label",
        "marketplace_purchase",
        "member",
        "membership",
        "merge_group",
        "meta",
        "milestone",
        "org_block",
        "organization",
        "package",
        "page_build",
        "personal_access_token_request",
        "ping",
        "project_card",
        "project",
        "project_column",
        "projects_v2",
        "projects_v2_item",
        "projects_v2_status_update",
        "public",
        "pull_request",
        "pull_request_review_comment",
        "pull_request_review",
        "pull_request_review_thread",
        "push",
        "registry_package",
        "release",
        "repository_advisory",
        "repository",
        "repository_dispatch",
        "repository_import",
        "repository_ruleset",
        "repository_vulnerability_alert",
        "secret_scanning_alert",
        "secret_scanning_alert_location",
        "security_advisory",
        "security_and_analysis",
        "sponsorship",
        "star",
        "status",
        "sub_issues",
        "team_add",
        "team",
        "watch",
        "workflow_dispatch",
        "workflow_job",
        "workflow_run",
      ].map((type) => ({ events: type })),
    ],
  };
};

const getDiscordCompletions = async (
  accessToken: string,
): Promise<Record<string, unknown>> => {
  const rest = new REST({ authPrefix: "Bearer" }).setToken(
    accessToken,
  );
  const guilds = await rest.get(Routes.userGuilds()) as { id: string }[];

  return { data: guilds.map(({ id }) => ({ guildId: id })) };
};

const notionCompletions = async (
  accessToken: string,
): Promise<Record<string, unknown>> => {
  return { data: [{ event: "create_page" }] };
};

const getGoogleMailCompletions = async (
  accessToken: string,
): Promise<Record<string, unknown>> => {
  return { data: [{ event: "Send Email" }] };
};

const getGoogleDriveCOmpletions = async (
  accessToken: string,
): Promise<Record<string, unknown>> => {
  return { data: [{ event: "Create file" }] };
};

const getGoogleCalendarCompletions = async (
  accessToken: string,
): Promise<Record<string, unknown>> => {
  const calendar = google.calendar("v3");
  const auth = new google.auth.OAuth2();
  auth.setCredentials({ access_token: accessToken });
  google.options({ auth });

  return { data: [{ event: "Create event" }] };
};

const completionsMap = {
  "github": getGitHubCompletions,
  "discord": getDiscordCompletions,
  "notion": notionCompletions,
  "google-mail": getGoogleMailCompletions,
  "google-calendar": getGoogleCalendarCompletions,
  "google-drive": getGoogleDriveCOmpletions,
} as const;

export const complete = async (
  service: keyof typeof completionsMap,
  accessToken: string,
) => completionsMap[service](accessToken);
