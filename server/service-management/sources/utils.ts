const HOSTS = {
  DATABASE: process.env["DATABASE_HOST"],
  GATEWAY: process.env["GATEWAY_HOST"],
};

export const host = (key: keyof typeof HOSTS, path: string) =>
  `http://${HOSTS[key]}${path}`;

/**
* Recover the code_verifier and state from the end-user session. This is necessary to complete the
* Authorization Code Grant Request.
*/
export const getSession = async () => {
  const id = 1;
  const response = await fetch(
    host("DATABASE", "/service-management/get-oauth-session"),
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id,
      }),
    },
  );

  if (!response.ok) {
    console.log("Failed to retrieve OAuth session: ", await response.text());
    return undefined;
  }

  const { code_verifier, state } = await response.json();
  return { code_verifier, state };
}

/** 
 * Store the access_token, refresh_token, and expires_in in the database.
 */
export const storeServiceSubscription = async (serviceInformation: any) => {
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
}

/**
 * Get the service subscription from the database.
 */
export const getServiceSubscription = async (service: string, user_id: number) => {
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
  if(!response.ok) {
    console.log("Failed to retrieve service subscription: ", await response.text());
    return undefined
  }
  else {
    return await response.json();
  }
};

/**
 * Update the service subscription in the database.
 */
export const updateServiceSubscription = async (serviceInformation: any) => {
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
}

/**
 * Delete the service subscription from the database.
 */
export const deleteServiceSubscription = async (service: string, user_id: number) => {
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
}
