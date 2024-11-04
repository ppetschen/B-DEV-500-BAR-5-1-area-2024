import { z } from "zod";
import type { Server } from "bun";

interface NarrowRequest<T> extends Request {
  json: () => Promise<T>;
}

export type Route<
  S extends z.ZodTypeAny = z.ZodTypeAny,
  P extends z.infer<S> = z.infer<S>,
> = {
  path: string;
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  schema: S;
  handler: (
    request: NarrowRequest<P>,
    server: Server,
  ) => Promise<Response>;
};

export type JWTResponse = {
  algorithm: string;
  consumer: {
    id: string;
  };
  created_at: number;
  id: string;
  key: string;
  rsa_public_key: null;
  secret: string;
  tags: null;
};

export interface UserInfo {
  email: string;
  id: number;
  primary: boolean;
  verified: boolean;
  visibility: string;
}

export interface ServiceSubscription {
  access_token: string | undefined;
  refresh_token: string | undefined;
  expires_in: string | undefined;
  user_id: number | undefined;
  service: string;
}

export interface ServicesByUserList {
  services: string[];
}

export interface Strategy {
  issuer: URL;
  redirect_uri: string;
  algorithm: "oidc" | "oauth2";
  client_id: string;
  client_secret: string;
  scope: string;
  userinfo_endpoint: string;
  token_endpoint: string;
}

export class customError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}
