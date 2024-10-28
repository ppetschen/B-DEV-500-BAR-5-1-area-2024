import * as oauth from "oauth4webapi";
import { getOauthStrategy } from "../oauthStrategy/oauthStrategies";
import type { ServiceSubscription } from "../types";
import { updateServiceSubscription } from "./serviceController";

/**
 * Refresh the access token and update the database with the new token.
 * @param serviceSubscription - The subscription object containing the service subscription information
 * @returns {ServiceSubscription} - Returns the updated service subscription object if successful, otherwise
 * @returns {boolean} - Returns false if the refresh token is not available
 */
export const oauthRefreshAccessToken = async (
  serviceSubscription: ServiceSubscription,
): Promise<ServiceSubscription | boolean> => {
  try {
    // Refresh Token Grant Request & Response
    const refresh_token = serviceSubscription.refresh_token;
    if (!refresh_token) {
      throw Error("Refresh token not available");
    }

    const strategy = getOauthStrategy(serviceSubscription.service);
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

    const response = await oauth.refreshTokenGrantRequest(
      as,
      client,
      clientAuth,
      refresh_token,
    );

    const result = await oauth.processRefreshTokenResponse(
      as,
      client,
      response,
    );
    const expirationDate = (new Date(Date.now() + result.expires_in! * 1000))
      .toISOString();
    const data = {
      access_token: result.access_token,
      refresh_token: result.refresh_token
        ? result.refresh_token
        : serviceSubscription.refresh_token,
      expires_in: expirationDate,
      user_id: serviceSubscription.user_id,
      service: serviceSubscription.service,
    };
    const storeStatus = await updateServiceSubscription(data);
    if (!storeStatus.ok) {
      throw Error("Error updating service subscription");
    }
    const service = await storeStatus.json();
    return service;
  } catch (error) {
    console.log("Error refreshing access token", error);
    return false;
  }
};
