import type { Route } from "../../types";
import { z } from "zod";
import { deleteServiceSubscription, getServiceSubscription, host } from "../../utils";
import jwt from "jsonwebtoken";

const schema = z.object({
    service: z.string(),
    user_id: z.number(),
}
);

const route: Route<typeof schema> = {
    path: "/auth/delete-service-subscription",
    method: "DELETE",
    schema,
    handler: async (request, _server) => {
        const token = request.headers.get("authorization")?.split("Bearer ")[1];
        const { service, user_id } = await request.json();

        const response = await deleteServiceSubscription(service, user_id);

        return response;
    },
};

export default route;