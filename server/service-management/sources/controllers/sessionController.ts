import { host } from "../utils";
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
};
