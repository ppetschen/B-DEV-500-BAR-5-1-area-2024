import process from "node:process";
const HOSTS = {
  DATABASE: process.env["DATABASE_HOST"],
};

export const host = (key: keyof typeof HOSTS, path: string) =>
  `http://${HOSTS[key]}${path}`;
