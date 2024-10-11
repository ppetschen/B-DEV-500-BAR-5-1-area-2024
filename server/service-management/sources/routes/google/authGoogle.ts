import * as oauth from 'oauth4webapi';
import type { Route } from "../../types";
import { z } from "zod";
import { host } from "../../utils";

const schema = z.never();

// Prerequisites for OAuth
let issuer = new URL(process.env.GOOGLE_ISSUER!); // Set your issuer URL here
let client_id = process.env.GOOGLE_CLIENT_ID!;
let client_secret = process.env.GOOGLE_CLIENT_SECRET!;
let redirect_uri = process.env.GOOGLE_REDIRECT_URI!;
let algorithm: 'oauth2' | 'oidc' | undefined = 'oidc'; // Default to 'oidc'

// Discovery Request
const as = await oauth
  .discoveryRequest(issuer, { algorithm })
  .then((response) => oauth.processDiscoveryResponse(issuer, response));

// OAuth2 Client Configuration
const client: oauth.Client = { client_id };
const clientAuth = oauth.ClientSecretPost(client_secret);

const code_challenge_method = 'S256'
/**
 * The following MUST be generated for every redirect to the authorization_endpoint. You must store
 * the code_verifier and nonce in the end-user session such that it can be recovered as the user
 * gets redirected from the authorization server back to your application.
 */
const code_verifier = oauth.generateRandomCodeVerifier()
const code_challenge = await oauth.calculatePKCECodeChallenge(code_verifier)
let state = oauth.generateRandomState()

// Define the route for Google authentication redirection
const route: Route<typeof schema> = {
  path: "/auth/google",
  method: "GET",
  schema,
  handler: async (request, server) => {
    // redirect user to as.authorization_endpoint
    const authorizationUrl = new URL(as.authorization_endpoint!)
    authorizationUrl.searchParams.set('client_id', client.client_id)
    authorizationUrl.searchParams.set('redirect_uri', redirect_uri)
    authorizationUrl.searchParams.set('response_type', 'code')
    authorizationUrl.searchParams.set('access_type', 'offline')
    authorizationUrl.searchParams.set('prompt', 'consent')
    authorizationUrl.searchParams.set('scope','https://www.googleapis.com/auth/userinfo.profile email')
    authorizationUrl.searchParams.set('code_challenge', code_challenge)
    authorizationUrl.searchParams.set('code_challenge_method', code_challenge_method)
    authorizationUrl.searchParams.set('state', state)

    /**
   * We cannot be sure the AS supports PKCE so we're going to use state too. Use of PKCE is
   * backwards compatible even if the AS doesn't support it which is why we're using it regardless.
   */
  //   if (as.code_challenge_methods_supported?.includes('S256') !== true) {
  //     state = oauth.generateRandomState()
  //     authorizationUrl.searchParams.set('state', state)
  //   }
    /**
     * Store the code_verifier and state in the end-user session such that it can be recovered as the user
     * we will do this in the database postgresql
     */

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
    return Response.redirect(authorizationUrl.href);
  }
};


export default route;
