import process from "node:process";
import type { HookContext, InternalConfig } from "./types";
import ejs from "ejs";
import { googleCreateDriveFile, googleSendEmail } from "./controllers/sendGoogleMail";
import { getServiceSubscription } from "./controllers/serviceController";

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

const createGoogleMailWebhook = async (
  _context: unknown,
) => {
  return {
    url: "",
  };
};

const createGoogleDriveWebhook = async (
  _context: unknown,
) => {
  return {
    url: "",
  };
};

export const createWebHookMap = {
  "discord": createDiscordWebhook,
  "google-mail": createGoogleMailWebhook,
  "google-drive": createGoogleDriveWebhook,
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

const sendDiscordWebhook = async (
  { execution_endpoint, view }: HookContext,
) => {
  const response = await fetch(execution_endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ content: view }),
  });

  if (!response.ok) {
    throw new Error("Failed to send webhook");
  }
};

const sendGoogleMail = async (
  { reaction_id, view }: HookContext,
) => {
  const findRequest = await fetch(host("DATABASE", "/reaction/find"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id: reaction_id }),
  });

  if (!findRequest.ok) {
    throw new Error("Failed to find reaction");
  }

  const { owner_id: user_id } = await findRequest.json();
  const findServiceSubscription = await getServiceSubscription(
    "google-mail",
    user_id,
  );
  const serviceSubscription = findServiceSubscription;
  const emailContext = {
    access_token: serviceSubscription.data.access_token,
    subject: `New Notification from ${reaction_id}`,
    body: view,
  };
  
  const response = await googleSendEmail(emailContext);
  if (!response) {
    throw new Error("Failed to send email");
  }
};

const createGoogleDriveFile = async (
  { reaction_id, view }: HookContext,
) => {
  const findRequest = await fetch(host("DATABASE", "/reaction/find"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id: reaction_id }),
  });

  if (!findRequest.ok) {
    throw new Error("Failed to find reaction");
  }

  const { owner_id: user_id } = await findRequest.json();
  const findServiceSubscription = await getServiceSubscription(
    "google-drive",
    user_id,
  );
  
  const serviceSubscription = findServiceSubscription;
  const driveContext = {
    access_token: serviceSubscription.data.access_token,
    file_name: `New Notification from ${reaction_id}`,
    file_content: view,
  };
  const response = await googleCreateDriveFile(driveContext);
  if (!response) {
    throw new Error("Failed to create file");
  }
};

const sendWebHookMap = {
  "discord": sendDiscordWebhook,
  "google-mail": sendGoogleMail,
  "google-drive": createGoogleDriveFile,
} as const;

export const send = async (
  type: keyof typeof sendWebHookMap,
  context: HookContext,
): Promise<void> => sendWebHookMap[type](context);
