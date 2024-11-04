import type { Route } from "../types";
import { z } from "zod";
import { authorizeService } from "../controllers/oAuth4WebApiAuthController";
import { getUserByToken } from "../controllers/userController";

const schema = z.object({
  headers: z.object({
    authorization: z.string(),
  }),
});

const route: Route<typeof schema> = {
  path: "/auth",
  method: "GET",
  schema,
  handler: async (request, _server) => {
    try {
      const service = new URLSearchParams(request.url.split("?")[1]).get(
        "service",
      );
      const token = request.headers.get("authorization")?.split("Bearer ")[1];
      if (!token || !service) {
        throw Error("Token or service not found");
      }

      const user = await getUserByToken(token!);
      if (!user) {
        throw Error("User not found");
      }

      const redirect = await authorizeService(service, user.email);
      if (!redirect || typeof redirect === "boolean") {
        throw Error("Redirect not found");
      }
      return new Response(redirect.href, { status: 200 });
    } catch (error) {
      console.log("Error in google auth", error);
      return new Response("Failed to authorize service", { status: 500 });
    }
  },
};

export default route;
 