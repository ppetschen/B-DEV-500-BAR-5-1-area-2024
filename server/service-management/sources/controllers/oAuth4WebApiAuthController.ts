import * as oauth from "oauth4webapi";
import { getOauthStrategy, type AuthStrategy } from "../oauthStrategy/oauthStrategies";
import { saveSession } from "./sessionController";

export const authorizeService = async (
  service: string,
  user_email: string,
  client_type: string,
): Promise<URL | boolean> => {
  try {
    const strategy: AuthStrategy = getOauthStrategy(service);
    if (!strategy) {
      throw Error("Failed to get strategy");
    }

    if (strategy.algorithm === "oauth1") {
      const response = await fetch(strategy.request_token_endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          oauth_callback: strategy.redirect_uri,
          oauth_consumer_key: strategy.client_id,
          oauth_signature: strategy.client_secret,
        }),
      });
  
      if (!response.ok) {
        throw new Error("Failed to obtain request token");
      }

      const data = await response.text();
      const requestToken = new URLSearchParams(data).get("oauth_token");
      const redirectUrl = `${strategy.authorization_endpoint}?oauth_token=${requestToken}`;

      return new URL(redirectUrl);
  }
    let authorizationUrl;
    if (strategy.algorithm == "oidc") {
      const as = await oauth
        .discoveryRequest(strategy.issuer, { algorithm: strategy.algorithm })
        .then((response) =>
          oauth.processDiscoveryResponse(strategy.issuer, response)
        );
      authorizationUrl = new URL(as.authorization_endpoint!);
    } else {
      authorizationUrl = new URL(strategy.issuer);
    }
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
    authorizationUrl.searchParams.set("client_id", strategy.client_id || "");
    authorizationUrl.searchParams.set(
      "redirect_uri",
      strategy.redirect_uri || "",
    );
    authorizationUrl.searchParams.set("response_type", "code");
    authorizationUrl.searchParams.set("access_type", "offline");
    authorizationUrl.searchParams.set("prompt", "consent");
    authorizationUrl.searchParams.set("scope", strategy.scope);
    authorizationUrl.searchParams.set("code_challenge", code_challenge);
    authorizationUrl.searchParams.set("code_challenge_method", "S256");
    authorizationUrl.searchParams.set("state", state);
    const response = await saveSession(
      code_verifier,
      state,
      user_email,
      service,
      client_type,
    );
    if (!response) {
      throw Error("Failed to save session");
    }
    return authorizationUrl;
  } catch (error) {
    console.log("Failed to authorize service: ", error);
    return false;
  }
};
