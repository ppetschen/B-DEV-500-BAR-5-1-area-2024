# service-management

## How to add service to service-management

### Important files

- .env
- ./sources/oauthStrategy/oauthStrategies.ts

### .env

Add the correct data for spec service in the .env file. EXAMPLE_CLIENT_ID=
EXAMPLE_CLIENT_SECRET= EXAMPLE_REDIRECT_URI=

### ./sources/oauthStrategy/oauthStrategies.ts

Add correct data for spec service in the oauthStrategies file /**

- Example strategy for a new service
- const getNewServiceStrategy = () => {
- const newServiceStrategy = {
- issuer: new URL("https://new-service.com"),
- redirect_uri: process.env.NEW_SERVICE_REDIRECT_URI!,
- algorithm: "oidc", "oauth2" or "oauth1"   // (!) depending on the service (!)
- client_id: process.env.NEW_SERVICE_CLIENT_ID!,
- client_secret: process.env.NEW_SERVICE_CLIENT_SECRET!,
- scope: "(!) check service documentation (!)",
- userinfo_endpoint: "https://new-service.com/userinfo",
- token_endpoint: "https://new-service.com/token",
- };
- return newServiceStrategy; */
