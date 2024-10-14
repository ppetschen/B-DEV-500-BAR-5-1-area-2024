import * as oauth from "oauth4webapi";
import type { Route } from "../../types";
import { z } from "zod";
import process from "node:process";
import { saveSession } from "../../controllers/sessionController";

const schema = z.any();

const route: Route<typeof schema> = {
  path: "/auth/google",
  method: "GET",
  schema,
  handler: async (_request, _server) => {
    const issuer = new URL(process.env.GOOGLE_ISSUER!);
    const as = await oauth
      .discoveryRequest(issuer, { algorithm: "oidc" })
      .then((response) => oauth.processDiscoveryResponse(issuer, response));
    /**
     * The following MUST be generated for every redirect to the authorization_endpoint.
     * You must store the code_verifier and nonce in the end-user session such that it
     * can be recovered as the user
     * gets redirected from the authorization server back to your application.
     */
    const code_verifier = oauth.generateRandomCodeVerifier();
    const code_challenge = await oauth.calculatePKCECodeChallenge(
      code_verifier,
    );
    const state = oauth.generateRandomState();
    const authorizationUrl = new URL(as.authorization_endpoint!);
    authorizationUrl.searchParams.set(
      "client_id",
      process.env.GOOGLE_CLIENT_ID!,
    );
    authorizationUrl.searchParams.set(
      "redirect_uri",
      process.env.GOOGLE_REDIRECT_URI!,
    );
    authorizationUrl.searchParams.set("response_type", "code");
    authorizationUrl.searchParams.set("access_type", "offline");
    authorizationUrl.searchParams.set("prompt", "consent");
    authorizationUrl.searchParams.set(
      "scope",
      "https://www.googleapis.com/auth/userinfo.profile email https://www.googleapis.com/auth/gmail.send https://www.googleapis.com/auth/drive.file",
    );
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
