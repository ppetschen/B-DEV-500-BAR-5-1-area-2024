import process from "node:process";

export const getOauthStrategy = (service: string) => {
  switch (service) {
    case "google":
      return getGoogleStrategy();
    case "github":
      return getGithubStrategy();
    case "discord":
      return getDiscordStrategy();
    // case "new-service":
    //   return getNewServiceStrategy();
    default:
      throw new Error("Strategy not found");
  }
};
const getGoogleStrategy = () => {
  const googleStrategy = {
    issuer: new URL("https://accounts.google.com"),
    redirect_uri: process.env.GOOGLE_REDIRECT_URI!,
    algorithm: "oidc",
    client_id: process.env.GOOGLE_CLIENT_ID!,
    client_secret: process.env.GOOGLE_CLIENT_SECRET!,
    scope:
      "https://www.googleapis.com/auth/userinfo.profile email https://www.googleapis.com/auth/gmail.send https://www.googleapis.com/auth/drive.file",
    userinfo_endpoint: "https://www.googleapis.com/oauth2/v3/userinfo",
    token_endpoint: "", // Is not needed for google
  };
  return googleStrategy;
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
  };
  return discordStrategy;
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