import * as oauth from "oauth4webapi";
import type { Route } from "../../types";
import { z } from "zod";
import { getSession } from "../../controllers/sessionController";
import type { UserInfo } from "../../types";
import { getUserByEmail } from "../../controllers/userController";
import {
  getServiceSubscription,
  storeServiceSubscription,
  updateServiceSubscription,
} from "../../controllers/serviceController";
import process from "node:process";

const schema = z.object({});

const service = "github";

// one eternity later, the user lands back on the redirect_uri
// Authorization Code Grant Request & Response
// Define the route for handling the OAuth callback
const route: Route<typeof schema> = {
  path: "/auth/github/callback",
  method: "GET",
  schema,
  handler: async (request, _server) => {
    // Prerequisites for OAuth
    const client_id = process.env.GITHUB_CLIENT_ID!;
    const client_secret = process.env.GITHUB_CLIENT_SECRET!;
    const redirect_uri = process.env.GITHUB_REDIRECT_URI!;

    const as: oauth.AuthorizationServer = {
      issuer: process.env.GITHUB_ISSUER!, // Add the issuer field
      authorization_endpoint: "https://github.com/login/oauth/authorize",
      token_endpoint: "https://github.com/login/oauth/access_token",
    };

    // OAuth2 Client Configuration
    const client: oauth.Client = { client_id };
    const clientAuth = oauth.ClientSecretPost(client_secret);
    const currentUrl = new URL(request.url);
    const session = await getSession();

    if (!session) {
      console.log("Session not found");
      return new Response(
        JSON.stringify({ error: "There was an error with the session" }),
        { status: 500 },
      );
    }

    const { code_verifier, state } = session;
    const params = oauth.validateAuthResponse(as, client, currentUrl, state);
    const response = await oauth.authorizationCodeGrantRequest(
      as,
      client,
      clientAuth,
      params,
      redirect_uri,
      code_verifier,
    );
    const result = await oauth.processAuthorizationCodeResponse(
      as,
      client,
      response,
    );

    /** Retrieve user based of result fields, maybe by email sent back?? Then set user_id from the db */
    const userinfoResponse = await fetch("https://api.github.com/user/emails", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${result.access_token}`,
      },
    });
    let userinfo = await userinfoResponse.json();

    if (!userinfo) {
      console.log("Failed to retrieve user info");
      return new Response(
        JSON.stringify({ error: "Failed to retrieve user info" }),
        { status: 500 },
      );
    }
    userinfo = userinfo.find((info: UserInfo) => info.primary === true);
    userinfo = await getUserByEmail(userinfo.email);

    if (!userinfo.ok) {
      console.log("No user with that email found");
      return new Response(
        JSON.stringify({ error: "No user with that email found" }),
        { status: 404 },
      );
    }
    const user = await userinfo.json();

    const serviceSubscription = await getServiceSubscription(service, user.id);
    let storeStatus;
    if (serviceSubscription) {
      storeStatus = await updateServiceSubscription({
        access_token: result.access_token,
        refresh_token: result.refresh_token,
        expires_in: result.expires_in,
        user_id: user.id,
        service,
      });
    } else {
      storeStatus = await storeServiceSubscription({
        access_token: result.access_token,
        refresh_token: result.refresh_token,
        expires_in: result.expires_in,
        user_id: user.id,
        service,
      });
    }
    if (!storeStatus.ok) {
      return new Response(
        JSON.stringify({
          error: "Failed to store service subscription",
        }),
        { status: 500 },
      );
    }
    return Response.redirect("/service-management/info", 302);
  },
};

export default route;
