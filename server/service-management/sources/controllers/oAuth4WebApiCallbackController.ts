import * as oauth from "oauth4webapi";
import { getOauthStrategy } from "../oauthStrategy/oauthStrategies";
import { getAndDeleteSession } from "./sessionController";
import { getUserByEmail } from "./userController";
import {
  getServiceSubscription,
  storeServiceSubscription,
  updateServiceSubscription,
} from "./serviceController";

export const authorizeServiceCallback = async (
  service: string,
  request_url: string,
): Promise<boolean> => {
  try {
    const strategy = getOauthStrategy(service);
    if (!strategy) {
      throw Error("Strategy not found");
    }
    let as;
    if (strategy.algorithm == "oidc") {
      as = await oauth
        .discoveryRequest(strategy.issuer, { algorithm: strategy.algorithm })
        .then((response) =>
          oauth.processDiscoveryResponse(strategy.issuer, response)
        );
    } else {
      const _as: oauth.AuthorizationServer = {
        issuer: strategy.issuer.href,
        authorization_endpoint: strategy.issuer.href,
        token_endpoint: strategy.token_endpoint,
      };
      as = _as;
    }

    const client: oauth.Client = { client_id: strategy.client_id || "" };
    const clientAuth = oauth.ClientSecretPost(
      strategy.client_secret || "",
    );
    const currentUrl = new URL(request_url);
    const state = currentUrl.searchParams.get("state");
    if (!state) {
      throw Error("State not found");
    }
    const session = await getAndDeleteSession(state);
    if (!session) {
      throw Error("Failed to get session");
    }
    const params = oauth.validateAuthResponse(as, client, currentUrl, state);
    const response = await oauth.authorizationCodeGrantRequest(
      as,
      client,
      clientAuth,
      params,
      strategy.redirect_uri || "",
      session.code_verifier,
    );
    const result = await oauth.processAuthorizationCodeResponse(
      as,
      client,
      response,
    );
    /** Retrieve user based of result fields, maybe by email sent back?? Then set user_id from the db */
    const userResponse = await fetch(
      strategy.userinfo_endpoint,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${result.access_token}`,
        },
      },
    );
    if (!userResponse.ok) {
      console.log("Userinfo response: ", userResponse);
      throw Error("Failed to retrieve user info");
    }
    let user = await userResponse.json();

    if (!user) {
      throw Error("Failed to retrieve user info");
    }
    const user_email = user.email ? user.email : user[0].email;

    if (user_email !== session.user_email) {
      throw Error("User email does not match");
    }

    user = await getUserByEmail(user_email);

    if (!user) {
      throw Error("User not found");
    }

    const serviceSubscription = await getServiceSubscription(service, user.id);

    const expirationDate = new Date(Date.now() + result.expires_in! * 1000);
    const data = {
      access_token: result.access_token,
      refresh_token: result.refresh_token,
      expires_in: expirationDate.toISOString(),
      user_id: user.id,
      service,
    };
    const storeStatus = serviceSubscription
      ? await updateServiceSubscription(data)
      : await storeServiceSubscription(data);
    if (!storeStatus.ok) {
      throw Error("Failed to store service subscription");
    }
    return true;
  } catch (error) {
    console.log("Failed to authorize service: ", error);
    return false;
  }
};
