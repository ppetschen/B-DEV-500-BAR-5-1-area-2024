import { host } from "../utils";
/**
 * Recover the code_verifier and state from the end-user session. This is necessary to complete the
 * Authorization Code Grant Request.
 */
export const getAndDeleteSession = async (state: string) => {
  const response = await fetch(
    host("DATABASE", "/user-management/delete-oauth-session"),
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
    host("DATABASE", "/user-management/get-oauth-session"),
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
  client_type: string,
) => {
  const response = await fetch(
    host("DATABASE", "/user-management/create-oauth-session"),
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        code_verifier,
        state,
        client_type,
      }),
    },
  );
  return response;
};
