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
  primary: boolean;
  verified: boolean;
  visibility: string;
}

export interface ServiceSubscription {
  access_token: string | undefined;
  refresh_token: string | undefined;
  expires_in: number | undefined;
  user_id: number | undefined;
  service: string | undefined;
}
