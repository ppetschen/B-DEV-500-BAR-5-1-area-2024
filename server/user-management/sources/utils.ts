import { randomUUID } from "crypto";
import type { JWTResponse } from "./types";
import jwt from "jsonwebtoken";

const HOSTS = {
  DATABASE: process.env["DATABASE_HOST"],
  GATEWAY: process.env["GATEWAY_HOST"],
};

export const host = (key: keyof typeof HOSTS, path: string) =>
  `http://${HOSTS[key]}${path}`;

export const createConsumer = async (id: string) => {
  const response = await fetch(host("GATEWAY", "/consumers"), {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: `username=${id}&custom_id=${randomUUID()}`,
  });

  if (!response.ok) {
    throw new Error("Failed to create consumer");
  }

  return await response.json();
};

export const getConsumer = async (id: string) => {
  const response = await fetch(host("GATEWAY", `/consumers/${id}`), {
    method: "GET",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  });

  if (!response.ok) {
    throw new Error("Failed to get consumer");
  }

  return await response.json();
};

export const createJWT = async (): Promise<JWTResponse> => {
  const id = process.env["JWT_CONSUMER_NAME"]!;
  const response = await fetch(host("GATEWAY", `/consumers/${id}/jwt`), {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  });

  if (!response.ok) {
    throw new Error("Failed to create JWT");
  }

  return await response.json();
};

export const getJWTsForConsumer = async (id: string): Promise<
  {
    data: JWTResponse[];
    next: string | null;
  }
> => {
  const response = await fetch(host("GATEWAY", `/consumers/${id}/jwt`), {
    method: "GET",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  });

  if (!response.ok) {
    console.error(await response.text());
    throw new Error("Failed to get JWTs");
  }

  return await response.json();
};

export const craftJWTFromResponse = (
  realm: "USER" | "SERVICE",
  { key, consumer: { id } }: JWTResponse,
) => {
  return jwt.sign(
    {
      consumer: id,
      realm,
    },
    key,
    {
      algorithm: "HS256",
      expiresIn: "1h",
    },
  );
};

export const setupConsumer = async () => {
  const id = process.env["JWT_CONSUMER_NAME"]!;
  try {
    await getConsumer(id);
  } catch (error) {
    await createConsumer(id);
  }

  try {
    const credentials = await getJWTsForConsumer(id);

    if (credentials.data.length > 0) {
      return;
    }
  } catch (error) {
    console.error(error);
  }
};
