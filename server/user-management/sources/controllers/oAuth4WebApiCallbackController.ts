import * as oauth from "oauth4webapi";
import { getOauthStrategy } from "../oauthStrategy/oauthStrategies";
import { getAndDeleteSession } from "./sessionController";

export const authorizeServiceCallback = async (
  service: string,
  request_url: string,
): Promise<string> => {
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
    const clientAuth = oauth.ClientSecretPost(strategy.client_secret || "");
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

    let response = await oauth.authorizationCodeGrantRequest(
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

    let user = await getUserFromService(strategy, result.access_token); // External user from service

    const email = getEmailFromUser(user);

    return email;
  } catch (error) {
    console.log("Failed to authorize service: ", error);
    return "";
  }
};

const getUserFromService = async (strategy: any, access_token: string) => {
  try {
    const response = await fetch(
      strategy.userinfo_endpoint,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${access_token}`,
          "Client-Id": strategy.client_id,
          "Notion-Version": "2022-06-28",
        },
      },
    );
    return await getjsonContent(response);
  } catch (error) {
    console.log("Failed to get user from service: ", error);
    return {};
  }
};
const getEmailFromUser = (user: any): string => {
  try {
    return (
      user?.email ||
      user?.[0]?.email ||
      user?.data?.[0]?.email ||
      user?.results?.[0]?.person?.email ||
      ""
    );
  } catch (error) {
    console.log("Failed to get email from user: ", error);
    return "";
  }
};

const getjsonContent = async (data: any) => {
  try {
    const jsonData = await data.json();
    if (!jsonData) {
      throw Error("Failed to get json content");
    }
    return jsonData;
  } catch (error) {
    console.log("Failed to get json content: ", error);
    return {};
  }
};
