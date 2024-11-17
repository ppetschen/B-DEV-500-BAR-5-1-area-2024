import * as oauth from "oauth4webapi";
import { getOauthStrategy, type AuthStrategy, } from "../oauthStrategy/oauthStrategies";
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
    const strategy: AuthStrategy = getOauthStrategy(service);
    if (!strategy) {
      throw Error("Strategy not found");
    }
    // // OAuth 1.0-specific logic
    // if (strategy.algorithm === "oauth1") {
    //   const oauthToken = new URL(request_url).searchParams.get("oauth_token");
    //   const oauthVerifier = new URL(request_url).searchParams.get("oauth_verifier");

    //   if (!oauthToken || !oauthVerifier) {
    //     throw new Error("Missing OAuth token or verifier");
    //   }

    //   // Exchange the request token and verifier for an access token
    //   const response = await fetch(strategy.token_endpoint, {
    //     method: "POST",
    //     headers: {
    //       "Content-Type": "application/x-www-form-urlencoded",
    //     },
    //     body: new URLSearchParams({
    //       oauth_token: oauthToken,
    //       oauth_verifier: oauthVerifier,
    //       oauth_consumer_key: strategy.client_id,
    //       oauth_signature: strategy.client_secret,
    //     }),
    //   });

    //   if (!response.ok) {
    //     throw new Error("Failed to obtain access token");
    //   }

    //   const data = await response.text();
    //   const accessToken = new URLSearchParams(data).get("oauth_token");

    //   if (!accessToken) {
    //     throw new Error("Access token not found in response");
    //   }

    //   // Fetch user information from the OAuth 1.0 service
    //   const userInfoResponse = await fetch(strategy.userinfo_endpoint, {
    //     method: "GET",
    //     headers: {
    //       Authorization: `OAuth ${accessToken}`,
    //     },
    //   });

    //   if (!userInfoResponse.ok) {
    //     throw new Error("Failed to fetch user info");
    //   }

    //   const userInfo = await userInfoResponse.json();
    //   const userEmail = getEmailFromUser(userInfo);

    //   // Save the subscription
    //   const user = await getUserByEmail(userEmail);
    //   const serviceSubscription = await getServiceSubscription(service, user.id);

    //   const dataToStore = {
    //     access_token: accessToken,
    //     refresh_token: "", // OAuth 1.0 often doesn't have refresh tokens
    //     expires_in: "", // OAuth 1.0 tokens are often long-lived
    //     user_id: user.id,
    //     service,
    //     webhook_url: "", //? Add if the service supports webhooks
    //   };

    //   const storeStatus = serviceSubscription
    //     ? await updateServiceSubscription(dataToStore)
    //     : await storeServiceSubscription(dataToStore);

    //   if (!storeStatus.ok) {
    //     throw new Error("Failed to store service subscription");
    //   }

    //   return true;
    // }

    if (strategy.algorithm === "oauth1") {
      // OAuth 1.0-specific logic for Trello
      const oauthToken = new URL(request_url).searchParams.get("oauth_token");
      const oauthVerifier = new URL(request_url).searchParams.get("oauth_verifier");

      if (!oauthToken || !oauthVerifier) {
        throw new Error("Missing OAuth token or verifier");
      }

      // Exchange the request token and verifier for an access token
      const response = await fetch(strategy.token_endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          oauth_token: oauthToken,
          oauth_verifier: oauthVerifier,
          oauth_consumer_key: strategy.client_id,
          oauth_signature: strategy.client_secret,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to obtain access token");
      }

      const data = await response.text();
      const accessToken = new URLSearchParams(data).get("oauth_token");

      if (!accessToken) {
        throw new Error("Access token not found in response");
      }

      // Fetch user information from Trello's API
      const userInfoResponse = await fetch(strategy.userinfo_endpoint!, {
        method: "GET",
        headers: {
          Authorization: `OAuth oauth_token="${accessToken}"`,
        },
      });

      if (!userInfoResponse.ok) {
        throw new Error("Failed to fetch user info");
      }

      const userInfo = await userInfoResponse.json();
      const userEmail = getEmailFromUser(userInfo);

      if (!userEmail) {
        throw new Error("User email not found");
      }

      // Save user subscription details
      const user = await getUserByEmail(userEmail);
      const serviceSubscription = await getServiceSubscription(service, user.id);

      const dataToStore = {
        access_token: accessToken,
        refresh_token: "", // OAuth 1.0 does not typically have refresh tokens
        expires_in: "", // OAuth 1.0 tokens are often long-lived
        user_id: user.id,
        service,
        webhook_url: "", //? Add webhook URL if the service supports webhooks
      };

      const storeStatus = serviceSubscription
        ? await updateServiceSubscription(dataToStore)
        : await storeServiceSubscription(dataToStore);

      if (!storeStatus.ok) {
        throw new Error("Failed to store service subscription");
      }

      return true;
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

    let response;
    if (strategy.client_auth_method === "Basic Auth") {
      const code = currentUrl.searchParams.get("code");
      response = await authorizationCodeGrantRequestBasicAuth(code!, strategy);
    } else {
      response = await oauth.authorizationCodeGrantRequest(
        as,
        client,
        clientAuth,
        params,
        strategy.redirect_uri || "",
        session.code_verifier,
      );
      response = await response.json();
    }
    const scopeToString = response;
    try {
      scopeToString.scope = scopeToString.scope.join(" ");
    } catch (error) {
      // Do nothing. Scope is already a string
    }
    response = new Response(JSON.stringify(scopeToString), {
      headers: {
        "Content-Type": "application/json",
      },
    });

    const result: any = await oauth.processAuthorizationCodeResponse(
      as,
      client,
      response,
    );

    let user = await getUserFromService(strategy, result.access_token); // External user from service

    const user_email = getEmailFromUser(user);

    user = await getUserByEmail(user_email); // Internal user from database

    const serviceSubscription = await getServiceSubscription(service, user.id);

    const expirationDate = new Date(
      Date.now() + (result.expires_in || 864000) * 1000,
    );
    const data = {
      access_token: result.access_token,
      refresh_token: result.refresh_token || "",
      expires_in: expirationDate.toISOString(),
      user_id: user.id,
      service,
      webhook_url: result.webhook ? result.webhook.url : "",
    };
    console.log("Data: ", data);
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

const authorizationCodeGrantRequestBasicAuth = async (
  code: string,
  strategy: any,
) => {
  try {
    const encoded = Buffer.from(
      `${strategy.client_id}:${strategy.client_secret}`,
    ).toString("base64");
    const response = await fetch(strategy.token_endpoint, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Basic ${encoded}`,
      },
      body: JSON.stringify({
        grant_type: "authorization_code",
        code: code,
        redirect_uri: strategy.redirect_uri,
      }),
    });
    return await getjsonContent(response);
  } catch (error) {
    console.log("Failed to get authorization code request: ", error);
    return { error: "Failed to get authorization code request" };
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
