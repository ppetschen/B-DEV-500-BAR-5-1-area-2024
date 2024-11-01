import type { Route } from "../../types";
import { z } from "zod";
import { deleteServiceSubscription } from "../../controllers/serviceController";
import { getUserByToken } from "../../controllers/userController";

const schema = z.object({
  service: z.string(),
});

const route: Route<typeof schema> = {
  path: "/auth/delete-service-subscription",
  method: "DELETE",
  schema,
  handler: async (request, _server) => {
    const token = request.headers.get("authorization")?.split("Bearer ")[1];
    const user = await getUserByToken(token!);
    const user_id = user.id;
    const { service } = await request.json();

    const response = await deleteServiceSubscription(service, user_id);

    return response;
  },
};

export default route;
