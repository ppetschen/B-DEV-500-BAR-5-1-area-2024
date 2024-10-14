import type { Route } from "../types";
import { z } from "zod";
import { host } from "../utils";

const schema = z.any();

const route: Route<typeof schema> = {
  path: "/execute",
  method: "POST",
  schema,
  handler: async (request, _server) => {
    const id = new URLSearchParams(request.url.split("?")[1]).get("id");

    if (!id) {
      return new Response("Missing 'id' query parameter", { status: 400 });
    }

    const getReactionRequest = await fetch(
      host("DATABASE", `/reaction/resolve`),
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
      },
    );

    if (!getReactionRequest.ok) {
      return new Response(await getReactionRequest.text(), { status: 500 });
    }

    const { execution_endpoint, service_name, action_id } =
      await getReactionRequest.json();

    const getActionRequest = await fetch(
      host("DATABASE", `/action/resolve`),
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: action_id }),
      },
    );

    if (!getActionRequest.ok) {
      return new Response(await getActionRequest.text(), { status: 500 });
    }

    const { payload: execution_payload, owner_id } = await getActionRequest
      .json();

    let executeRequest;

    switch (service_name) {
      case "GOOGLE": {
        executeRequest = await fetch(
          host("REACTION", "/google/upload-to-drive"),
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              user_id: owner_id,
              payload: execution_payload,
            }),
          },
        );
        break;
      }
      default: {
        executeRequest = await fetch(
          execution_endpoint,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(execution_payload),
          },
        );
        break;
      }
    }

    let status: "success" | "failure" = executeRequest.ok
      ? "success"
      : "failure";

    const updateStateRequest = await fetch(
      host("DATABASE", "/area-composition/update-state"),
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id, status }),
      },
    );

    if (!updateStateRequest.ok) {
      return new Response(await updateStateRequest.text(), { status: 500 });
    }

    if (!executeRequest.ok) {
      return new Response(await executeRequest.text(), { status: 500 });
    }

    return new Response(await executeRequest.text(), { status: 200 });
  },
};

export default route;
