import { host } from "../utils";
/**
 * Recover the code_verifier and state from the end-user session. This is necessary to complete the
 * Authorization Code Grant Request.
 */
export const getAndDeleteSession = async (state: string) => {
  const response = await fetch(
    host("DATABASE", "/service-management/delete-oauth-session"),
    {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        state,
      }),
    },
  );
  const session = await response.json();
  return session;
};

/**
 * Recover the code_verifier and state from the end-user session. This is necessary to complete the
 * Authorization Code Grant Request.
 */
export const getSession = async (state: string) => {
  const response = await fetch(
    host("DATABASE", "/service-management/get-oauth-session"),
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        state,
      }),
    },
  );
  const session = await response.json();
  return session;
};

export const saveSession = async (
  code_verifier: string,
  state: string,
  user_email: string,
  service: string,
  client_type: string,
) => {
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
        user_email,
        service,
        client_type,
      }),
    },
  );
  return response;
};
