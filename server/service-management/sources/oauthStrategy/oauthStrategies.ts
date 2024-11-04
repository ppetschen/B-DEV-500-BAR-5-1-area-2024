import process from "node:process";

export const getOauthStrategy = (service: string) => {
  switch (service) {
    case "google":
      return getGoogleStrategy();
    case "google-mail":
      return getGmailStrategy();
    case "google-drive":
      return getGoogleDriveStrategy();
    case "google-calendar":
      return getGoogleCalendarStrategy();
    case "github":
      return getGithubStrategy();
    case "discord":
      return getDiscordStrategy();
    case "twitch":
      return getTwitchStrategy();
    case "notion":
      return getNotionStrategy();
    // case "new-service":
    //   return getNewServiceStrategy();
    default:
      throw new Error(`Service ${service} is not supported`);
  }
};
const getGoogleStrategy = () => {
  const strategy = {
    issuer: new URL("https://accounts.google.com"),
    redirect_uri: process.env.GOOGLE_REDIRECT_URI!,
    algorithm: "oidc",
    client_id: process.env.GOOGLE_CLIENT_ID!,
    client_secret: process.env.GOOGLE_CLIENT_SECRET!,
    scope: "email ",
    userinfo_endpoint: "https://www.googleapis.com/oauth2/v3/userinfo",
    token_endpoint: "",
    client_auth_method: "",
  };
  return strategy;
};
const getGmailStrategy = () => {
  const strategy = getGoogleStrategy();
  strategy.redirect_uri = process.env.GOOGLE_MAIL_REDIRECT_URI!,
  strategy.client_id = process.env.GOOGLE_MAIL_CLIENT_ID!,
  strategy.client_secret = process.env.GOOGLE_MAIL_CLIENT_SECRET!,
  strategy.scope += "https://www.googleapis.com/auth/gmail.send";
  return strategy;
};

const getGoogleDriveStrategy = () => {
  const strategy = getGoogleStrategy();
  strategy.redirect_uri = process.env.GOOGLE_DRIVE_REDIRECT_URI!,
  strategy.client_id = process.env.GOOGLE_DRIVE_CLIENT_ID!,
  strategy.client_secret = process.env.GOOGLE_DRIVE_CLIENT_SECRET!,
  strategy.scope += "https://www.googleapis.com/auth/drive.file";
  return strategy;
};

const getGoogleCalendarStrategy = () => {
  const strategy = getGoogleStrategy();
  strategy.redirect_uri = process.env.GOOGLE_CALENDAR_REDIRECT_URI!,
  strategy.client_id = process.env.GOOGLE_CALENDAR_CLIENT_ID!,
  strategy.client_secret = process.env.GOOGLE_CALENDAR_CLIENT_SECRET!,
  strategy.scope += "https://www.googleapis.com/auth/calendar.events";
  return strategy;
};

const getGithubStrategy = () => {
  const githubStrategy = {
    issuer: new URL("https://github.com/login/oauth/authorize"),
    redirect_uri: process.env.GITHUB_REDIRECT_URI!,
    algorithm: "oauth2",
    client_id: process.env.GITHUB_CLIENT_ID!,
    client_secret: process.env.GITHUB_CLIENT_SECRET!,
    scope: "user repo",
    userinfo_endpoint: "https://api.github.com/user/emails",
    token_endpoint: "https://github.com/login/oauth/access_token",
    client_auth_method: "",
  };
  return githubStrategy;
};

const getDiscordStrategy = () => {
  const discordStrategy = {
    issuer: new URL("https://discord.com/api/oauth2/authorize"),
    redirect_uri: process.env.DISCORD_REDIRECT_URI!,
    algorithm: "oauth2",
    client_id: process.env.DISCORD_CLIENT_ID!,
    client_secret: process.env.DISCORD_CLIENT_SECRET!,
    scope: "identify email",
    userinfo_endpoint: "https://discord.com/api/users/@me",
    token_endpoint: "https://discord.com/api/oauth2/token",
    client_auth_method: "",
  };
  return discordStrategy;
};

const getTwitchStrategy = () => {
  const twitchStrategy = {
    issuer: new URL("https://id.twitch.tv/oauth2/authorize"),
    redirect_uri: process.env.TWITCH_REDIRECT_URI!,
    algorithm: "oauth2",
    client_id: process.env.TWITCH_CLIENT_ID!,
    client_secret: process.env.TWITCH_CLIENT_SECRET!,
    scope: "user:read:email",
    userinfo_endpoint: "https://api.twitch.tv/helix/users",
    token_endpoint: "https://id.twitch.tv/oauth2/token",
    client_auth_method: "",
  };
  return twitchStrategy;
};

const getNotionStrategy = () => {
  const notionStrategy = {
    issuer: new URL("https://api.notion.com/v1/oauth/authorize"),
    redirect_uri: process.env.NOTION_REDIRECT_URI!,
    algorithm: "oauth2",
    client_id: process.env.NOTION_CLIENT_ID!,
    client_secret: process.env.NOTION_CLIENT_SECRET!,
    scope: "user:read read_content update_content",
    userinfo_endpoint: "https://api.notion.com/v1/users",
    token_endpoint: "https://api.notion.com/v1/oauth/token",
    client_auth_method: "Basic Auth",
  };
  return notionStrategy;
};

/**
 * Example strategy for a new service
 * const getNewServiceStrategy = () => {
 *  const newServiceStrategy = {
 *   issuer: new URL("https://new-service.com"),
 *  redirect_uri: process.env.NEW_SERVICE_REDIRECT_URI!,
 * algorithm: "oidc" or "oauth2", // (!) depending on the service (!)
 * client_id: process.env.NEW_SERVICE_CLIENT_ID!,
 * client_secret: process.env.NEW_SERVICE_CLIENT_SECRET!,
 * scope: "(!) check service documentation (!)",
 * userinfo_endpoint: "https://new-service.com/userinfo",
 * token_endpoint: "https://new-service.com/token",
 * };
 * return newServiceStrategy;
 */
