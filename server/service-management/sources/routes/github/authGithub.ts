import * as oauth from "oauth4webapi";
import type { Route } from "../../types";
import { z } from "zod";
import { host } from "../../utils";

const schema = z.any();

// OAuth Configuration for GitHub
let issuer = process.env.GITHUB_ISSUER!;
let client_id = process.env.GITHUB_CLIENT_ID!;
let client_secret = process.env.GITHUB_CLIENT_SECRET!;
let redirect_uri = process.env.GITHUB_REDIRECT_URI!;

const client: oauth.Client = { client_id };

const code_challenge_method = "S256";

const code_verifier = oauth.generateRandomCodeVerifier();
const code_challenge = await oauth.calculatePKCECodeChallenge(code_verifier);
let state = oauth.generateRandomState();

const route: Route<typeof schema> = {
  path: "/auth/github",
  method: "GET",
  schema,
  handler: async (request, server) => {
    const authorizationUrl = new URL(issuer);
    authorizationUrl.searchParams.set("client_id", client.client_id);
    authorizationUrl.searchParams.set("redirect_uri", redirect_uri);
    authorizationUrl.searchParams.set("response_type", "code");
    authorizationUrl.searchParams.set("scope", "user repo");
    authorizationUrl.searchParams.set("code_challenge", code_challenge);
    authorizationUrl.searchParams.set(
      "code_challenge_method",
      code_challenge_method,
    );
    authorizationUrl.searchParams.set("state", state);

    // Store code_verifier and state in the session or DB
    const response = await fetch(
      host("DATABASE", "/service-management/create-oauth-session"),
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          code_verifier,
          state,
        }),
      },
    );

    if (!response.ok) {
      return new Response(await response.text(), { status: 500 });
    }

    // Redirect the user to GitHub for authentication
    return Response.redirect(authorizationUrl.href);
  },
};

export default route;
