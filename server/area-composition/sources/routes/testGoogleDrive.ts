import type { Route } from "../types";
import { z } from "zod";
import { host } from "../utils";

const schema = z.any();

const route: Route<typeof schema> = {
    path: "/test/google-drive",
    method: "POST",
    schema,
    handler: async (request, _server) => {
        const { user_id, file_name, file_content } = await request.json();
        const response = await fetch(
            host("REACTION", "/google/upload-to-drive"),
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    user_id,
                    file_name,
                    file_content,
                }),
            },
        );
        if (!response.ok) {
            return new Response(JSON.stringify({ success: false }), { status: 500 });
        }
        else {
            return new Response(JSON.stringify({ success: true }), { status: 200 });
        }
    },
};

export default route;