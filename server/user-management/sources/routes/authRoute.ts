import { authorizeService } from "../controllers/oAuth4WebApiAuthController";
import type { Route } from "../types";
import { z } from "zod";

const schema = z.never();

const route: Route<typeof schema> = {
  path: "/auth",
  method: "GET",
  schema,
  handler: async (request, _server) => {
    try {
      const service = new URLSearchParams(request.url.split("?")[1]).get(
        "service",
      );
      if (!service) {
        throw new Error("Service not found");
      }
      
      const redirect = await authorizeService(service);
      if (!redirect || typeof redirect === "boolean") {
        throw Error("Redirect not found");
      }
      return new Response(redirect.href, { status: 200 });
    } catch (error) {
      console.log("Error in auth", error);
      return new Response("Failed to authorize service", { status: 500 });
    }
  },
};

export default route;
