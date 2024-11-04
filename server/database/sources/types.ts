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

export class customError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}
