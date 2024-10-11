import { Glob } from "bun";
import { client } from ".";

export const initTables = async () => {
  const glob = new Glob("models/*.sql");
  const result = glob.scan({
    cwd: new URL(".", import.meta.url).pathname,
    absolute: true,
    onlyFiles: true,
  });
  const tables = await Array.fromAsync(result, (file) => Bun.file(file));
  const contents = await Promise.all(tables.map((table) => table.text()));

  for (const content of contents) {
    await client.query(content);
  }
};

const HOSTS = {
  GATEWAY: process.env["GATEWAY_HOST"],
};

export const host = (key: keyof typeof HOSTS, path: string) =>
  `http://${HOSTS[key]}${path}`;
