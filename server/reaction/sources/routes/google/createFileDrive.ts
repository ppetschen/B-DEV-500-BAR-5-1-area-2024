import { createFileInDrive, getServiceSubscription } from "../../controllers/serviceController";
import type { Route } from "../../types";
import { z } from "zod";

const schema = z.object({
    user_id: z.number(),
    payload: z.object({name: z.string(), content: z.string()}),
});

const service = "google";

const route: Route<typeof schema> = {
    path: "/google/upload-to-drive",
    method: "POST",
    schema,
    handler: async (request, _server) => {
        console.log("google/upload-to-drive");
        const { user_id, payload: { name:file_name, content:file_content }} = await request.json();
        const serviceSubscription = await getServiceSubscription(service, user_id);
        if (!serviceSubscription) {
            return new Response(JSON.stringify({ success: false }), { status: 404 });
        };
        const response = await createFileInDrive(serviceSubscription.access_token, file_name, file_content);
        if (!response.ok) {
            return new Response(JSON.stringify({ success: false }), { status: 500 });
        }
        return new Response(JSON.stringify({ success: true }), { status: 200 });
    },
};

export default route;