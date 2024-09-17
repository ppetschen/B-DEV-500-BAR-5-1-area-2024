# GitHub OAuth2 Login API

> [!NOTE]\
> This is a work in progress. The API documentation is not complete.

## Overview

This API allows users to authenticate via GitHub OAuth2 and retrieve information
about the logged-in user.

## Authentication Flow

1. **User Login**: Redirect the user to GitHub for authentication.
2. **Callback**: GitHub redirects back to the application with an authorization
   code.
3. **Exchange Code for Token**: The application exchanges the authorization code
   for an access token.
4. **Retrieve User Info**: Use the access token to fetch the authenticated
   user's information from GitHub.

## API Endpoints

### 1. Request GitHub Authorization

**Endpoint:** `GET /auth/github`

**Description:** Redirects the user to GitHub for authorization.

**Query Parameters:**

- `client_id` (required): The client ID of your GitHub application.
- `redirect_uri` (required): The URI GitHub should redirect to after
  authentication.
- `scope` (optional): The scope of access requested (e.g., `user`).

**Example Request:**

```http
GET /auth/github?client_id=your_client_id&redirect_uri=https://yourapp.com/callback&scope=user
```

**Response:**

- This is a redirect to GitHub's authorization page.

### 2. Exchange Code for Access Token

**Endpoint:** `POST /auth/github/callback`

**Description:** Exchanges the authorization code for an access token.

**Request Body:**

- `code` (required): The authorization code received from GitHub.
- `client_id` (required): The client ID of your GitHub application.
- `client_secret` (required): The client secret of your GitHub application.
- `redirect_uri` (required): The URI GitHub redirected to after authentication.

**Example Request:**

```http
POST /auth/github/callback
Content-Type: application/x-www-form-urlencoded

code=authorization_code&client_id=your_client_id&client_secret=your_client_secret&redirect_uri=https://yourapp.com/callback
```

**Response:**

```json
{
    "access_token": "your_access_token",
    "token_type": "bearer",
    "scope": "user"
}
```

### 3. Retrieve User Information

**Endpoint:** `GET /user`

**Description:** Retrieves information about the logged-in user from GitHub.

**Headers:**

- `Authorization` (required): `Bearer $your_access_token`

**Example Request:**

```http
GET /user
Authorization: Bearer your_access_token
```

**Response:**

```json
{
    "login": "username",
    "id": 123456,
    "node_id": "MDQ6VXNlcjEyMzQ1Ng==",
    "avatar_url": "https://avatars.githubusercontent.com/u/123456?v=4",
    "gravatar_id": "",
    "url": "https://api.github.com/users/username",
    "html_url": "https://github.com/username",
    "followers_url": "https://api.github.com/users/username/followers",
    "following_url": "https://api.github.com/users/username/following{/other_user}",
    "gists_url": "https://api.github.com/users/username/gists{/gist_id}",
    "starred_url": "https://api.github.com/users/username/starred{/owner}{/repo}",
    "subscriptions_url": "https://api.github.com/users/username/subscriptions",
    "organizations_url": "https://api.github.com/users/username/orgs",
    "repos_url": "https://api.github.com/users/username/repos",
    "events_url": "https://api.github.com/users/username/events{/privacy}",
    "received_events_url": "https://api.github.com/users/username/received_events",
    "type": "User",
    "site_admin": false
}
```

## Error Responses

### Error in Code Exchange

**Response:**

```json
{
    "error": "invalid_request",
    "error_description": "The request is missing a required parameter or includes an invalid parameter."
}
```

### Error Retrieving User Information

**Response:**

```json
{
    "message": "Bad credentials",
    "documentation_url": "https://docs.github.com/rest/reference/users#get-the-authenticated-user"
}
```
