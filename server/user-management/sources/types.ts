import { z } from "zod";
import type { Server } from "bun";

interface NarrowRequest<T> extends Request {
  json: () => Promise<T>;
}

//? export type MobileRequest<P = any> = NarrowRequest<P> & { isMobile?: boolean };

export type Route<
  S extends z.ZodTypeAny = z.ZodTypeAny,
  P extends z.infer<S> = z.infer<S>,
> = {
  path: string;
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  schema: S;
  //? handler: (request: MobileRequest<P>, server: Server) => Promise<Response>;
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
  first_name: string;
  last_name: string;
  description: string;
  password: string;
  hashedPassword: string;
  password_hash: string;
}

export class customError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}
