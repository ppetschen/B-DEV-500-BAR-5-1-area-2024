import process from "node:process";

export type OAuth1Strategy = {
  issuer: URL;
  redirect_uri: string;
  algorithm: "oauth1";
  client_id: string;
  client_secret: string;
  request_token_endpoint: string;
  authorization_endpoint: string;
  token_endpoint: string;
  userinfo_endpoint: string;
};

export type OAuth2Strategy = {
  issuer: URL;
  redirect_uri: string;
  algorithm: "oauth2" | "oidc";
  client_id: string;
  client_secret: string;
  scope: string;
  userinfo_endpoint: string;
  token_endpoint: string;
  client_auth_method: string;
};

export type AuthStrategy = OAuth1Strategy | OAuth2Strategy;

export const getOauthStrategy = (service: string): AuthStrategy => {
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
    case "trello":
      return getTrelloStrategy();
    // case "new-service":
    //   return getNewServiceStrategy();
    default:
      throw new Error(`Service ${service} is not supported`);
  }
};
const getGoogleStrategy = (): OAuth2Strategy => {
  const strategy: OAuth2Strategy = {
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
const getGmailStrategy = (): OAuth2Strategy => {
  const strategy: OAuth2Strategy = getGoogleStrategy();
  strategy.redirect_uri = process.env.GOOGLE_MAIL_REDIRECT_URI!,
    strategy.client_id = process.env.GOOGLE_MAIL_CLIENT_ID!,
    strategy.client_secret = process.env.GOOGLE_MAIL_CLIENT_SECRET!,
    strategy.scope +=
      "https://www.googleapis.com/auth/gmail.send https://www.googleapis.com/auth/gmail.modify https://www.googleapis.com/auth/gmail.readonly";
  return strategy;
};

const getGoogleDriveStrategy = (): OAuth2Strategy => {
  const strategy: OAuth2Strategy = getGoogleStrategy();
  strategy.redirect_uri = process.env.GOOGLE_DRIVE_REDIRECT_URI!,
    strategy.client_id = process.env.GOOGLE_DRIVE_CLIENT_ID!,
    strategy.client_secret = process.env.GOOGLE_DRIVE_CLIENT_SECRET!,
    strategy.scope += "https://www.googleapis.com/auth/drive.file";
  return strategy;
};

const getGoogleCalendarStrategy = (): OAuth2Strategy => {
  const strategy: OAuth2Strategy = getGoogleStrategy();
  strategy.redirect_uri = process.env.GOOGLE_CALENDAR_REDIRECT_URI!,
    strategy.client_id = process.env.GOOGLE_CALENDAR_CLIENT_ID!,
    strategy.client_secret = process.env.GOOGLE_CALENDAR_CLIENT_SECRET!,
    strategy.scope += "https://www.googleapis.com/auth/calendar";
  return strategy;
};

const getGithubStrategy = (): OAuth2Strategy => {
  const githubStrategy: OAuth2Strategy = {
    issuer: new URL("https://github.com/login/oauth/authorize"),
    redirect_uri: process.env.GITHUB_REDIRECT_URI!,
    algorithm: "oauth2",
    client_id: process.env.GITHUB_CLIENT_ID!,
    client_secret: process.env.GITHUB_CLIENT_SECRET!,
    scope: "user:email write:repo_hook",
    userinfo_endpoint: "https://api.github.com/user/emails",
    token_endpoint: "https://github.com/login/oauth/access_token",
    client_auth_method: "",
  };
  return githubStrategy;
};

const getDiscordStrategy = (): OAuth2Strategy => {
  const discordStrategy: OAuth2Strategy = {
    issuer: new URL("https://discord.com/api/oauth2/authorize"),
    redirect_uri: process.env.DISCORD_REDIRECT_URI!,
    algorithm: "oauth2",
    client_id: process.env.DISCORD_CLIENT_ID!,
    client_secret: process.env.DISCORD_CLIENT_SECRET!,
    scope: "identify email webhook.incoming guilds",
    userinfo_endpoint: "https://discord.com/api/users/@me",
    token_endpoint: "https://discord.com/api/oauth2/token",
    client_auth_method: "",
  };
  return discordStrategy;
};

const getTwitchStrategy = (): OAuth2Strategy => {
  const twitchStrategy: OAuth2Strategy = {
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

const getNotionStrategy = (): OAuth2Strategy => {
  const notionStrategy: OAuth2Strategy = {
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

const getTrelloStrategy = (): OAuth1Strategy => {
  const trelloStrategy: OAuth1Strategy = {
    issuer: new URL("https://trello.com"),
    redirect_uri: process.env.TRELLO_REDIRECT_URI!,
    algorithm: "oauth1",
    client_id: process.env.TRELLO_CLIENT_ID!,
    client_secret: process.env.TRELLO_CLIENT_SECRET!,
    request_token_endpoint: "https://trello.com/1/OAuthGetRequestToken",
    token_endpoint: "https://trello.com/1/OAuthGetAccessToken",
    authorization_endpoint: "https://trello.com/1/OAuthAuthorizeToken",
    // userinfo_endpoint: "https://api.trello.com/1/members/me",
  };
  return trelloStrategy;
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
