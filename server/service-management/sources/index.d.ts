declare module "bun" {
  interface Env {
    PORT: number;
    GATEWAY_HOST: string;
    KONG_DELAY_MS: number | undefined;
  }
}
