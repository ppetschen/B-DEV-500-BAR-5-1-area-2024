import { host } from "../utils";

export const getUserByEmail = async (email: string) => {
    
  const userRequest = await fetch(
    host("DATABASE", "/user-management/get-user-by-email"),
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    },
  );

  return userRequest;

};
