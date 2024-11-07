import process from "node:process";
import type { InternalConfig } from "./types";
import ejs from "ejs";

const HOSTS = {
  DATABASE: process.env["DATABASE_HOST"],
  SERVICE_MANAGEMENT: process.env["SERVICE_MANAGEMENT_HOST"],
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

const createDiscordWebhook = async (
  context: unknown,
) => {
  const { webhook_url } = getKey<InternalConfig>(
    context,
    "_internal",
  );

  if (!webhook_url) {
    throw new Error("No webhook url provided");
  }

  return {
    url: webhook_url,
  };
};

export const createWebHookMap = {
  "discord": createDiscordWebhook,
} as const;

export const create = async (
  type: keyof typeof createWebHookMap,
  context: unknown & { _internal: InternalConfig },
): Promise<{ url: string }> => createWebHookMap[type](context);

export const renderEjs = async (markup: string, context: unknown) => {
  if (!(context instanceof Object)) {
    throw new Error("Context is not an object");
  }

  return ejs.render(markup, context);
};

const sendDiscordWebhook = async (content: string, url: string) => {
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ content }),
  });

  if (!response.ok) {
    throw new Error("Failed to send webhook");
  }
};
/**
 * Since this is not a webhook, we dont need the createWebHook function? 
 * Also is there a need to put this in either the createWebHookMap or sendWebHookMap?
 */
const sendGoogleMail = async (content: string, url: string) => {
  // Here i would need a TO, SUBJECT and a BODY for the email
  // I would also need the access_token to this function.
  // Everything else will be the same for all emails sent
  // Can you guide me on how to implement this for this architecture
};

const sendWebHookMap = {
  "discord": sendDiscordWebhook,
} as const;

export const send = async (
  type: keyof typeof sendWebHookMap,
  content: string,
  url: string,
): Promise<void> => sendWebHookMap[type](content, url);
