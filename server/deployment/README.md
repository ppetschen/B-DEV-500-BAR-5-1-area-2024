# deployment

> [!WARNING]
> Please fill in the service-management
> [`.env`](../service-management/.env.example) file with the correct OAuth2 and
> JWT secrets.

```sh
docker compose up
```

## adding routes to Kong

> [!TIP]
> Each service inside this monorepo should have a `Dockerfile` at the root of
> its directory to build the image.

In order to add routes to Kong, you will need to modify both the config file
[`kong.yaml`](./config/kong.yaml) and the docker-compose file
[`docker-compose.yaml`](./docker-compose.yaml).

First, add the service to the `services` section of the `kong.yaml` file. The
`name` field should be the name of the service, and the `url` field should be
the URL of the service. This URL should be the name of the service in the
`docker-compose.yaml` file, since we are using Docker's internal DNS to resolve
the service's IP address.

```yaml
services:
  # ... other services
  - name: example-service
    url: http://example-service:3000
    routes:
      - name: example-route
        paths:
          - /example
```

If the server needs `JWT` authentication, you can add the `plugins` field to the
service.

```yaml
services:
  # ... other services
  - name: example-service
    # ... other fields
    plugins:
      - name: jwt
        config:
          uri_param_names:
            - paramName_2.2.x
```

Next, add the service to the `services` section of the `docker-compose.yaml`
file. The `name` field should be the name of the service, and the `build` field
should be the path to the service's `Dockerfile`.

> [!WARNING]
> The `context` field should be the path to the service's directory relative to
> the `docker-compose.yaml` file. Make sure to add the `networks` and
> `depends_on` fields as well.

```yaml
services:
  # ... other services
  example-service:
    build:
      context: ../example
      dockerfile: Dockerfile
    environment:
      <<: *kong-env
      PORT: 3000
      # ... other environment variables
    networks:
      - kong-net
    depends_on:
      - kong-gateway
```

Since we need to interact with external services, we need to get a public URL,
using [`cloudflared`](https://github.com/cloudflare/cloudflared). To do this,
run the following command:

```sh
cloudflared tunnel --url localhost:8000

2024-11-05T14:53:02Z INF +--------------------------------------------------------------------------------------------+
2024-11-05T14:53:02Z INF |  Your quick Tunnel has been created! Visit it at (it may take some time to be reachable):  |
2024-11-05T14:53:02Z INF |  https://your-unique-url.trycloudflare.com                                                 |
2024-11-05T14:53:02Z INF +--------------------------------------------------------------------------------------------+
```

Finally, run the following command to start the services and Kong. You should
now be able to access the service at
`https://your-unique-url.trycloudflare.com/example`.

```sh
PUBLIC_URL=https://your-unique-url.trycloudflare.com docker compose up
```

## debugging

In order to check the current registered routes in Kong, you can use the Kong
Admin API. To access the API, you can use the following command:

```sh
curl http://localhost:8001/routes |jq
```

If you are unsure of the exposed routes for each service, you can use the
following command:

```sh
curl https://your-unique-url.trycloudflare.com/my-service/info |jq
```

This will return the service's information, including the available routes.
