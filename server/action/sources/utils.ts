import process from "node:process";
import { Octokit } from "@octokit/rest";
import type { InternalConfig } from "./types";

const HOSTS = {
  DATABASE: process.env["DATABASE_HOST"],
  ACTION: process.env["ACTION_HOST"],
};

export const host = (key: keyof typeof HOSTS, path: string) =>
  `http://${HOSTS[key]}${path}`;

function getKey<T>(
  object: unknown,
  key: string,
): T {
  if (typeof object !== "object" || object === null) {
    throw new Error("Object is not an object");
  }

  const obj = object as { [key: string]: unknown };

  if (key in obj) {
    return obj[key] as T;
  }

  throw new Error(`Key ${key} not found in object`);
}

const createGithubIssueWebhook = async (
  context: unknown,
) => {
  console.log("createGithubIssueWebhook");
  const { access_token: auth, reaction_id } = getKey<InternalConfig>(
    context,
    "_internal",
  );
  const client = new Octokit({ auth });
  const owner = getKey<string>(context, "owner");
  const repo = getKey<string>(context, "repo");
  const events = getKey<string[]>(context, "events");
  if (!events.length) {
    throw new Error("No events provided, required at least one");
  }
  console.log("PUBLIC_URL", process.env["PUBLIC_URL"]);
  await client.repos.createWebhook({
    owner,
    repo,
    events,
    config: {
      url: `${process.env["PUBLIC_URL"]}/reaction/execute?id=${reaction_id}`,
      content_type: "json",
    },
  });
};

export const createWebHookMap = {
  "github": createGithubIssueWebhook,
} as const;

export const create = async (
  type: keyof typeof createWebHookMap,
  context: unknown & { _internal: InternalConfig },
): Promise<void> => createWebHookMap[type](context);
