import type { UserInfo } from "../types";
import { host } from "../utils";
import jwt, { type JwtPayload } from "jsonwebtoken";

export const getUserByEmail = async (email: string): Promise<UserInfo> => {
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

  if (!response.ok) {
    throw new Error(`Failed to get user by email: ${response.statusText}`);
  }

  const user = await response.json();
  if (!user) {
    throw new Error("User not found");
  }
  return user;
};

export const getUserById = async (consumer: number): Promise<UserInfo> => {
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
  const user = await response.json();
  return await user;
};

export const getUserByToken = (token: string): Promise<UserInfo> => {
  const decodedToken = jwt.decode(token);
  let consumer;

  if (decodedToken && typeof decodedToken !== "string") {
    consumer = (decodedToken as JwtPayload).consumer;
  } else {
    console.error("Failed to decode token or token is invalid.");
  }
  const user = getUserById(consumer);
  return user;
};
