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
  const data = await octokit.paginate(octokit.repos.listForAuthenticatedUser, {
    per_page: 100,
  });

  return {
    data: data.map(({ owner, name }) => ({ owner: owner.login, name })),
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

const completionsMap = {
  "github": getGitHubCompletions,
  "discord": getDiscordCompletions,
} as const;

export const complete = async (
  service: keyof typeof completionsMap,
  accessToken: string,
) => completionsMap[service](accessToken);
