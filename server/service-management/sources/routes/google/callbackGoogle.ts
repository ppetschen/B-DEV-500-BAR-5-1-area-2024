import * as oauth from 'oauth4webapi';
import type { Route } from "../../types";
import { util, z } from "zod";
import { getServiceSubscription, getSession, host, storeServiceSubscription, updateServiceSubscription } from "../../utils";
import { getUserByEmail } from '../../controllers/userController';

const schema = z.object({});

// Prerequisites for OAuth
let issuer = new URL(process.env.GOOGLE_ISSUER!);
let client_id = process.env.GOOGLE_CLIENT_ID!;
let client_secret = process.env.GOOGLE_CLIENT_SECRET!;
let redirect_uri = process.env.GOOGLE_REDIRECT_URI!;

// Discovery Request
const as = await oauth
  .discoveryRequest(issuer, { algorithm: 'oidc' })
  .then((response) => oauth.processDiscoveryResponse(issuer, response));

// OAuth2 Client Configuration
const client: oauth.Client = { client_id };
const clientAuth = oauth.ClientSecretPost(client_secret);

// one eternity later, the user lands back on the redirect_uri
// Authorization Code Grant Request & Response
let access_token: string
// Define the route for handling the OAuth callback
const route: Route<typeof schema> = {
  path: "/auth/google/callback",
  method: "GET",
  schema,
  handler: async (request, _server) => {
    const currentUrl = new URL(request.url);
    const session = await getSession();

    if (!session) {
      console.log("Session not found");
      return new Response(JSON.stringify({ error: "There was an error with the session" }), { status: 500 });
    }

    const { code_verifier, state } = session;
    const params = oauth.validateAuthResponse(as, client, currentUrl, state)
    const response = await oauth.authorizationCodeGrantRequest(
      as,
      client,
      clientAuth,
      params,
      redirect_uri,
      code_verifier,
    )
    const result = await oauth.processAuthorizationCodeResponse(as, client, response)

    /** Retrieve user based of result fields, maybe by email sent back?? Then set user_id from the db */
    const userinfoResponse = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${result.access_token}`,
      },
    });
    let userinfo = await userinfoResponse.json();

    if(!userinfo) {
      console.log("Failed to retrieve user info");
      return new Response(JSON.stringify({ error: "Failed to retrieve user info" }), { status: 500 });
    }
    userinfo = await getUserByEmail(userinfo.email);

    if(!userinfo.ok) {
      console.log("No user with that email found");
      return new Response(JSON.stringify({ error: "No user with that email found" }), { status: 404 }); 
    }
    let user = await userinfo.json();
    const user_id = user.id;

    let serviceSubscription = await getServiceSubscription("google", user_id);
    let storeStatus;
    if (serviceSubscription) {
      storeStatus = await updateServiceSubscription({
        user_id,
        ...result,
        service: "google",
      });
    }
    else {
      storeStatus = await storeServiceSubscription({
        user_id,
        ...result,
        service: "google",
      });
    }
    if (!storeStatus.ok) {
      return new Response(JSON.stringify({
        error: "Failed to store service subscription",
      }), { status: 500 });
    }
    return Response.redirect('/service-management/info', 302);
  }
};

export default route;
