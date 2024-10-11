import type { ServiceSubscription } from "../types";
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
