import { host } from "../utils";

export const getUserByEmail = async (email: string) => {
  const response = await fetch(
    host("DATABASE", "/user-management/get-user-by-email"),
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    },
  );
  return response;
};

export const getUserById = async (consumer: number) => {
  const response = await fetch(
    host("DATABASE", "/user-management/get-user-by-id"),
    {
      method: "POST",
      headers: {
        "Authorization": "Bearer ${token}",
      },
      body: JSON.stringify({
        consumer,
      }),
    },
  );
  return response;
};
