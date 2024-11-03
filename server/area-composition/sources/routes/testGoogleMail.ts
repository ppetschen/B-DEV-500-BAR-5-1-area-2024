import type { Route } from "../types";
import { z } from "zod";

const schema = z.any();

const route: Route<typeof schema> = {
    path: "/callback/gmail",
    method: "POST",
    schema,
    handler: async (request, _server) => {
        try {
            console.log("Gmail callback received", request.url);
            const body = await request.json();
            console.log("Gmail callback body", body);
            return new Response('OK', { status: 200 });
        } catch (error) {
            console.error("Gmail callback error", error);
            return new Response('OK', { status: 200 });
        }
    },
};

export default route;
