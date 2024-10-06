declare module "bun" {
  interface Env {
    JWT_CONSUMER_NAME: string;
    JWT_CONSUMER_KEY: string;
    JWT_CONSUMER_SECRET: string;
    PORT: number;
    GATEWAY_HOST: string;
    KONG_DELAY_MS: number | undefined;
  }
}
