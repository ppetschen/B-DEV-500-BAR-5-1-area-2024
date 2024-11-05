import type { Route } from "../../types";
import { z } from "zod";
import { host, renderEjs, send } from "../../utils";

const schema = z.unknown();

const route: Route<typeof schema> = {
  path: "/execute",
  method: "POST",
  schema,
  handler: async (request, _server) => {
    const url = new URL(request.url);
    const id = url.searchParams.get("id");

    if (!id) {
      return new Response("Missing id", { status: 400 });
    }

    const body = await request.json();

    const findRequest = await fetch(host("DATABASE", "/reaction/find"), {
      method: "POST",
      headers: { ...request.headers },
      body: JSON.stringify({ id }),
    });

    if (!findRequest.ok) {
      return new Response("Failed to fetch reaction", { status: 500 });
    }

    const {
      id: reaction_id,
      markup,
      service_name,
      execution_endpoint,
    } = await findRequest.json();

    const view = await renderEjs(markup, body);

    await send(service_name, execution_endpoint, view);

    const updateStateRequest = await fetch(
      host("DATABASE", "/area-composition/update-state"),
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: reaction_id, status: "success" }),
      },
    );

    if (!updateStateRequest.ok) {
      return new Response("Failed to update state", { status: 500 });
    }

    return new Response("Executed", { status: 200 });
  },
};

export default route;
