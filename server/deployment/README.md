# deployment

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
        methods:
          - GET
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
    ports:
      - "3000:3000"
    networks:
      - kong-net
    depends_on:
      - kong-gateway
```

Finally, run `docker compose up` to start the services and Kong. You should now
be able to access the service at `http://localhost:8000/example`.

## debugging

In order to check the current registered routes in Kong, you can use the Kong
Admin API. To access the API, you can use the following command:

```sh
curl http://localhost:8001/routes |jq
```
