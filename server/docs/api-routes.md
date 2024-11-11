<!-- deno-fmt-ignore-file -->
# Api routes documentation

> [!IMPORTANT]
> This documentation was automatically generated using `Bun` version `1.1.34` on
> GitHub actions, commit hash `b6f47686032aa813b94ad3b9508066558a2fde3b`.

## reaction

```http
POST /reaction/execute/create
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
POST /reaction/execute/create
```
```ts
// This route is internal, won't be exposed
{
    type: "discord" | "google-mail" | "google-drive" | "notion" | "google-calendar";
    context?: unknown;
    markup: string;
}
```

```http
GET /reaction/execute/list
```
```ts
// This route is internal, won't be exposed
any
```

```http
POST /reaction/execute/execute
```
```ts
// This route is internal, won't be exposed
unknown
```

```http
POST /reaction/execute/google/upload-to-drive
```
```ts
// This route is internal, won't be exposed
{
    user_id: number;
    payload: {
        name: string;
        content: string;
    };
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
    password?: string;
}
```

```http
PUT /user-management/update-user
```
```ts
// This route is internal, won't be exposed
{
    new_password?: string;
    first_name?: string;
    last_name?: string;
    description?: string;
}
```

```http
DELETE /user-management/delete-user
```
```ts
// This route is internal, won't be exposed
never
```

```http
GET /user-management/auth/redirect
```
```ts
// This route is internal, won't be exposed
never
```

```http
GET /user-management/get-user
```
```ts
// This route is internal, won't be exposed
any
```

```http
POST /user-management/login
```
```ts
// This route is internal, won't be exposed
{
    email: string;
    password?: string;
}
```

```http
GET /user-management/auth
```
```ts
// This route is internal, won't be exposed
never
```

```http
GET /user-management/auth/callback
```
```ts
// This route is internal, won't be exposed
any
```


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
    owner_id: number;
}
```

```http
POST /create
```
```ts
// This route is internal, won't be exposed
{
    type: "github";
    context?: unknown;
    reaction_id: string;
}
```

```http
GET /list
```
```ts
// This route is internal, won't be exposed
any
```


## area-composition

```http
POST /area-composition/test/google-drive
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

```http
POST /area-composition/send-google-mail
```
```ts
// Authorization: Bearer $AUTH_TOKEN
{
    to: string;
    subject: string;
    content: string;
    access_token: string;
}
```

```http
POST /area-composition/execute
```
```ts
// Authorization: Bearer $AUTH_TOKEN
any
```

```http
POST /area-composition/compose
```
```ts
// Authorization: Bearer $AUTH_TOKEN
{
    from: {
        type: "github";
        context?: unknown;
    };
    to: {
        type: "discord" | "google-mail" | "google-drive" | "notion" | "google-calendar";
        context?: unknown;
    };
    markup: string;
}
```

```http
POST /area-composition/completions
```
```ts
// Authorization: Bearer $AUTH_TOKEN
{
    from: "github";
    to: "discord" | "notion" | "google-mail" | "google-calendar" | "google-drive";
}
```

```http
GET /area-composition/list
```
```ts
// Authorization: Bearer $AUTH_TOKEN
any
```

```http
GET /area-composition/available
```
```ts
// Authorization: Bearer $AUTH_TOKEN
any
```


## service-management

```http
GET /service-management/auth
```
```ts
// Authorization: Bearer $AUTH_TOKEN
{
    headers: {
        authorization: string;
    };
}
```

```http
GET /service-management/auth/callback
```
```ts
// Authorization: Bearer $AUTH_TOKEN
any
```

```http
POST /service-management/auth/is-user-subscribed
```
```ts
// Authorization: Bearer $AUTH_TOKEN
{
    service: string;
}
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
GET /service-management/auth/get-services-by-user
```
```ts
// Authorization: Bearer $AUTH_TOKEN
any
```

```http
POST /service-management/auth/get-service-subscription
```
```ts
// Authorization: Bearer $AUTH_TOKEN
{
    service: string;
    user_id: number;
}
```


## database

```http
POST /action/resolve
```
```ts
// This route is internal, won't be exposed
{
    id: string;
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
    owner_id: number;
}
```

```http
POST /action/new
```
```ts
// This route is internal, won't be exposed
{
    service_name: string;
    event_type: string;
    payload: {
        [x: string]: unknown;
    };
    owner_id: number;
}
```

```http
PUT /user-management/update-user
```
```ts
// This route is internal, won't be exposed
{
    id: number;
    email: string;
    password_hash: string;
    first_name: string;
    last_name: string;
    description: string;
}
```

```http
DELETE /user-management/delete-user
```
```ts
// This route is internal, won't be exposed
{
    id: number;
}
```

```http
POST /user-management/create-oauth-session
```
```ts
// This route is internal, won't be exposed
{
    code_verifier: string;
    state: string;
    user_email?: string;
    service?: string;
    client_type: string;
}
```

```http
POST /user-management/get-oauth-session
```
```ts
// This route is internal, won't be exposed
{
    state: string;
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

```http
DELETE /user-management/delete-oauth-session
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
POST /service-management/create-oauth-session
```
```ts
// This route is internal, won't be exposed
{
    code_verifier: string;
    state: string;
    user_email: string;
    service: string;
    client_type: string;
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
    expires_in?: any;
    webhook_url?: string | undefined;
}
```

```http
POST /service-management/get-oauth-session
```
```ts
// This route is internal, won't be exposed
{
    state: string;
}
```

```http
POST /service-management/get-services-by-user
```
```ts
// This route is internal, won't be exposed
{
    user_id: number;
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
    expires_in?: any;
    webhook_url?: string | undefined;
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
DELETE /service-management/delete-oauth-session
```
```ts
// This route is internal, won't be exposed
{
    state: string;
}
```

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
POST /area-composition/list-areas
```
```ts
// This route is internal, won't be exposed
{
    userId: number;
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
POST /reaction/resolve
```
```ts
// This route is internal, won't be exposed
{
    id: string;
}
```

```http
POST /reaction/find
```
```ts
// This route is internal, won't be exposed
{
    id: string;
}
```

```http
POST /reaction/new
```
```ts
// This route is internal, won't be exposed
{
    service_name: string;
    execution_endpoint: string;
    markup: string;
    status: "pending" | "failure" | "success";
    owner_id: number;
}
```

