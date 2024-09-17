import fastify from "fastify";

const app = fastify();

app.get("/", async () => {
  return { hello: "world" };
});

await app.listen({ port: 3000 });
