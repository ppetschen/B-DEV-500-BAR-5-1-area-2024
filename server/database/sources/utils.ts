import { Client } from "pg";

export const client = new Client({
  host: process.env["KONG_PG_HOST"],
  database: process.env["KONG_PG_DATABASE"],
  user: process.env["KONG_PG_USER"],
  password: process.env["KONG_PG_PASSWORD"],
});

try {
  await client.connect();
} catch (error) {
  console.error("Failed to connect to database", error);
}

const HOSTS = {
  GATEWAY: process.env["GATEWAY_HOST"],
};

export const host = (key: keyof typeof HOSTS, path: string) =>
  `http://${HOSTS[key]}${path}`;
