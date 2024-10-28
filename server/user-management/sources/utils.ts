import type { JWTResponse } from "./types";
import jwt from "jsonwebtoken";
import process from "node:process";

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
    body: `username=${id}`,
  });

  if (!response.ok) {
    throw new Error("Failed to create consumer");
  }

  return await response.json();
};

export const initConsumer = async (id: string) => {
  const secret = process.env["JWT_CONSUMER_SECRET"]!;

  const response = await fetch(host("GATEWAY", `/consumers/${id}/jwt`), {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: `algorithm=HS256&secret=${secret}`,
  });

  if (!response.ok) {
    throw new Error("Failed to init consumer");
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
  { key, secret }: JWTResponse,
  id: string,
) => {
  return jwt.sign(
    {
      consumer: id,
      realm,
    },
    secret,
    {
      algorithm: "HS256",
      expiresIn: "1h",
      issuer: key,
    },
  );
};

export const setupConsumer = async () => {
  const id = process.env["JWT_CONSUMER_NAME"]!;
  try {
    await getConsumer(id);
  } catch (error) {
    await createConsumer(id);
    await initConsumer(id);
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
