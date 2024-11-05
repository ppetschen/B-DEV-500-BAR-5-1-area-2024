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

export type InternalConfig = {
  access_token: string;
  refresh_token: string;
  webhook_url?: string;
};
