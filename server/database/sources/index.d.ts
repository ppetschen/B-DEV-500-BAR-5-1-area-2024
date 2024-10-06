declare module "bun" {
  interface Env {
    KONG_PG_HOST: string;
    KONG_PG_DATABASE: string;
    KONG_PG_USER: string;
    KONG_PG_PASSWORD: string;
    PORT: number;
    DATABASE_HOST: string;
    KONG_DELAY_MS: number | undefined;
  }
}
