import process from "node:process";
import { Octokit } from "@octokit/rest";
import { REST } from "@discordjs/rest";
import { Routes } from "discord-api-types/v10";

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
  const { data } = await octokit.repos.listForAuthenticatedUser();

  return { data: data.map(({ owner, name }) => ({ owner, name })) };
};

const getDiscordCompletions = async (
  accessToken: string,
): Promise<Record<string, unknown>> => {
  const rest = new REST({ version: "10" }).setToken(accessToken);
  const channels = await rest.get(Routes.userChannels());

  return { data: channels };
};

const completionsMap = {
  "GITHUB": getGitHubCompletions,
  "DISCORD": getDiscordCompletions,
} as const;

export const complete = async (
  service: keyof typeof completionsMap,
  accessToken: string,
) => completionsMap[service](accessToken);
