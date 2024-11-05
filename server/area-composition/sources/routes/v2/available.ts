import type { Route } from "../../types";
import { z } from "zod";

const schema = z.any();

const route: Route<typeof schema> = {
  path: "/available",
  method: "GET",
  schema,
  handler: async (_request, _server) => {
    // TODO(jabolo): centralize to/from available services
    return new Response("Not implemented", { status: 501 });
  },
};

export default route;
