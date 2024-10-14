import type { Route } from "../types";
import { z } from "zod";
import { host } from "../utils";

const schema = z.object({
  service_name: z.string().max(255),
  event_type: z.string().max(255),
  payload: z.record(z.unknown()),
  owner_id: z.number(),
});

const route: Route<typeof schema> = {
  path: "/create",
  method: "POST",
  schema,
  handler: async (request, _server) => {
    const { service_name, event_type, payload, owner_id } = await request
      .json();

    const insertRequest = await fetch(
      host("DATABASE", "/action/create"),
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ service_name, event_type, payload, owner_id }),
      },
    );

    if (!insertRequest.ok) {
      return new Response(await insertRequest.text(), { status: 500 });
    }

    const { id } = await insertRequest.json();

    return new Response(
      JSON.stringify({
        id,
      }),
      { status: 200 },
    );
  },
};

export default route;
