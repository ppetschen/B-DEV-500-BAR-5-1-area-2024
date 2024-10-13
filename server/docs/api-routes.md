# Api routes documentation

> [!IMPORTANT]
> This documentation was automatically generated using `Bun` version `1.1.30` on
> GitHub actions, commit hash `ee6b7a42424aa38dc1a99f9832387e9a3c640df2`.

## action

```http
POST /create
```
```ts
// This route is internal, won't be exposed
{
    service_name: string;
    event_type: string;
    payload: {
        [x: string]: unknown;
    };
}
```


## reaction

```http
POST /create
```
```ts
// This route is internal, won't be exposed
{
    action_id: string;
    service_name: string;
    execution_endpoint: string;
    status: "pending" | "failure" | "success";
}
```


## database

```http
POST /area-composition/update-state
```
```ts
// This route is internal, won't be exposed
{
    id: string;
    status: "success" | "failure" | "pending";
}
```

```http
POST /service-management/get-service-subscription
```
```ts
// This route is internal, won't be exposed
{
    user_id: number;
    service: string;
}
```

```http
POST /service-management/create-oauth-session
```
```ts
// This route is internal, won't be exposed
{
    code_verifier: string;
    state: string;
}
```

```http
PUT /service-management/update-service-subscription
```
```ts
// This route is internal, won't be exposed
{
    user_id: number;
    service: string;
    access_token: string;
    refresh_token: string;
    expires_in: number;
}
```

```http
POST /service-management/create-service-subscription
```
```ts
// This route is internal, won't be exposed
{
    user_id: number;
    service: string;
    access_token: string;
    refresh_token: string;
    expires_in: number;
}
```

```http
DELETE /service-management/delete-oauth-session
```
```ts
// This route is internal, won't be exposed
{
    state: string;
}
```

```http
DELETE /service-management/delete-service-subscription
```
```ts
// This route is internal, won't be exposed
{
    user_id: number;
    service: string;
}
```

```http
POST /reaction/create
```
```ts
// This route is internal, won't be exposed
{
    action_id: string;
    service_name: string;
    execution_endpoint: string;
    status: "pending" | "failure" | "success";
}
```

```http
POST /action/create
```
```ts
// This route is internal, won't be exposed
{
    service_name: string;
    event_type: string;
    payload: {
        [x: string]: unknown;
    };
}
```

```http
POST /user-management/get-user-by-id
```
```ts
// This route is internal, won't be exposed
{
    consumer: number;
}
```

```http
POST /user-management/create-user
```
```ts
// This route is internal, won't be exposed
{
    email: string;
    hashedPassword: string;
}
```

```http
POST /user-management/get-user-by-email
```
```ts
// This route is internal, won't be exposed
{
    email: string;
}
```


## service-management

```http
GET /service-management/auth/github
```
```ts
// Authorization: Bearer $AUTH_TOKEN
any
```

```http
GET /service-management/auth/github/callback
```
```ts
// Authorization: Bearer $AUTH_TOKEN
{}
```

```http
POST /service-management/auth/is_user_subscribed
```
```ts
// Authorization: Bearer $AUTH_TOKEN
{
    service: string;
}
```

```http
POST /service-management/auth/get-service-token
```
```ts
// Authorization: Bearer $AUTH_TOKEN
{
    service: string;
}
```

```http
GET /service-management/whoami
```
```ts
// Authorization: Bearer $AUTH_TOKEN
any
```

```http
DELETE /service-management/auth/delete-service-subscription
```
```ts
// Authorization: Bearer $AUTH_TOKEN
{
    service: string;
}
```

```http
GET /service-management/auth/google/callback
```
```ts
// Authorization: Bearer $AUTH_TOKEN
{}
```

```http
GET /service-management/auth/google
```
```ts
// Authorization: Bearer $AUTH_TOKEN
any
```

```http
GET /service-management/auth/discord
```
```ts
// Authorization: Bearer $AUTH_TOKEN
any
```

```http
GET /service-management/auth/discord/callback
```
```ts
// Authorization: Bearer $AUTH_TOKEN
{}
```


## area-composition

```http
POST /area-composition/execute
```
```ts
// Authorization: Bearer $AUTH_TOKEN
any
```

```http
POST /area-composition/create
```
```ts
// Authorization: Bearer $AUTH_TOKEN
{
    from_service_name: string;
    from_event_type: string;
    from_payload: {
        [x: string]: unknown;
    };
    to_service_name: string;
    to_execution_endpoint: string;
}
```


## user-management

```http
POST /user-management/register
```
```ts
// This route is internal, won't be exposed
{
    email: string;
    password: string;
}
```

```http
POST /user-management/login
```
```ts
// This route is internal, won't be exposed
{
    email: string;
    password: string;
}
```

