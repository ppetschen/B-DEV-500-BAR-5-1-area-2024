import {
  customError,
  type ServicesByUserList,
  type ServiceSubscription,
} from "../types";
import { host } from "../utils";

/**
 * Store the access_token, refresh_token, and expires_in in the database.
 */
export const storeServiceSubscription = async (
  serviceInformation: ServiceSubscription,
) => {
  {
    const response = await fetch(
      host("DATABASE", "/service-management/create-service-subscription"),
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...serviceInformation,
        }),
      },
    );
    return response;
  }
};

/**
 * Get the service subscription from the database.
 */
export const getServiceSubscription = async (
  service: string,
  user_id: number,
) => {
  const response = await fetch(
    host("DATABASE", "/service-management/get-service-subscription"),
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        service,
        user_id,
      }),
    },
  );
  if (!response.ok) {
    console.log(
      "Failed to retrieve service subscription: ",
      await response.text(),
    );
    return undefined;
  } else {
    return await response.json();
  }
};
/**
 * Update the service subscription in the database.
 */
export const updateServiceSubscription = async (
  serviceInformation: ServiceSubscription,
) => {
  const response = await fetch(
    host("DATABASE", "/service-management/update-service-subscription"),
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...serviceInformation,
      }),
    },
  );
  return response;
};

/**
 * Delete the service subscription from the database.
 */
export const deleteServiceSubscription = async (
  service: string,
  user_id: number,
) => {
  const response = await fetch(
    host("DATABASE", "/service-management/delete-service-subscription"),
    {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user_id,
        service,
      }),
    },
  );
  return response;
};

/**
 * Determines if the access token is still valid based on its expiration date.
 * @param serviceSubscription - The subscription object containing the token information
 * @returns {boolean} - Returns true if the access token is still valid, otherwise false
 */
export const isAccessTokenValid = (
  serviceSubscription: ServiceSubscription,
): boolean => {
  const currentTime = Date.now();
  const tokenExpirationTime = new Date(serviceSubscription.expires_in!)
    .getTime();
  return currentTime < tokenExpirationTime;
};

/**
 * Retrieves all services associated with a user.
 * @param user_id - The user id to retrieve services for
 * @returns {Promise<ServicesByUserList>} - Returns a list of services associated with the user
 */
export const getServicesByUserId = async (
  user_id: number,
): Promise<ServicesByUserList> => {
  try {
    const response = await fetch(
      host("DATABASE", "/service-management/get-services-by-user"),
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id,
        }),
      },
    );
    if (!response.ok) {
      if (response.status === 404) {
        return { services: [] }; // Return an empty services array
      }
      // For other errors, you may want to throw a custom error
      throw new customError(
        "Failed to retrieve services by user",
        response.status,
      );
    }
    const result = await response.json();
    const services = result.services;
    return { services };
  } catch (error) {
    console.log(error);
    throw new customError("Failed to retrieve services by user", 500);
  }
};
