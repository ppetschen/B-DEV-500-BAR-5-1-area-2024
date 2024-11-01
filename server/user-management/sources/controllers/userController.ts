import { customError, type UserInfo } from "../types";
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
  const user = await response.json();
  return user;
};

export const getUserById = async (consumer: number): Promise<UserInfo> => {
  const response = await fetch(
    host("DATABASE", "/user-management/get-user-by-id"),
    {
      method: "POST",
      body: JSON.stringify({
        consumer,
      }),
    },
  );
  if (!response.ok) {
    throw new customError("User not found", 404);
  }
  const user = await response.json();
  return user;
};

export const getUserByToken = async (token: string): Promise<UserInfo> => {
  const decodedToken = jwt.decode(token);
  let consumer;

  if (decodedToken && typeof decodedToken !== "string") {
    consumer = (decodedToken as JwtPayload)["consumer"];
  } else {
    console.error("Failed to decode token or token is invalid.");
    throw new customError("Failed to decode token or token is invalid.", 401);
  }
  const user = await getUserById(consumer);
  if (!user) {
    throw new customError("User not found", 404);
  }

  return user;
};
