import * as oauth from "oauth4webapi";
import type { Route } from "../../types";
import { z } from "zod";
import process from "node:process";
import { saveSession } from "../../controllers/sessionController";

const schema = z.any();

const route: Route<typeof schema> = {
  path: "/auth/github",
  method: "GET",
  schema,
  handler: async (_request, _server) => {
    console.log("Authenticating to GitHub");
    const code_verifier = oauth.generateRandomCodeVerifier();
    const code_challenge = await oauth.calculatePKCECodeChallenge(
      code_verifier,
    );
    const state = oauth.generateRandomState();

    const authorizationUrl = new URL(process.env.GITHUB_ISSUER!);
    authorizationUrl.searchParams.set(
      "client_id",
      process.env.GITHUB_CLIENT_ID!,
    );
    authorizationUrl.searchParams.set(
      "redirect_uri",
      process.env.GITHUB_REDIRECT_URI!,
    );
    authorizationUrl.searchParams.set("response_type", "code");
    authorizationUrl.searchParams.set("scope", "user repo");
    authorizationUrl.searchParams.set("code_challenge", code_challenge);
    authorizationUrl.searchParams.set("code_challenge_method", "S256");
    authorizationUrl.searchParams.set("state", state);

    const response = await saveSession(code_verifier, state);

    if (!response) {
      return new Response("Failed to save session", { status: 500 });
    }
    return Response.redirect(authorizationUrl.href);
  },
};

export default route;
