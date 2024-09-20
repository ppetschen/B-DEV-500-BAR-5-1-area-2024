# AREA

> [!NOTE]\
> This is a work in progress. Please check this documentation regularly for
> updates.

```
 _________________
< what is oauth2? >
 -----------------
        \   ^__^
         \  (oo)\_______
            (__)\       )\/\
                ||----w |
                ||     ||
```

## General Considerations

- **Role**: Software Architect team.
- **Objective**: Integrate existing libraries and focus on business logic rather
  than reinventing the wheel.
- **Key Goals**:
  - Understand, select, and integrate software components.
  - Focus on project management and ensure solid planning.

## Project Overview

- **Goal**: Create an automation platform like **IFTTT** or **Zapier** with
  three components:
  - **Application server** (handles business logic and features).
  - **Web client** (browser interface, queries the application server).
  - **Mobile client** (phone interface, queries the application server).
- **User Flow**:
  1. User registers and authenticates.
  2. Subscribes to services (e.g., Google, Outlook).
  3. Configures AREA (Action-REAction connections).
  4. Actions trigger REActions based on user configurations.

## Folder structure

> [!WARNING]\
> This project is a `monorepo`, each folder is a different project.

```bash
.
├── README.md
├── demo/
├── mobile/
├── www/
└── server/
```

- **demo**: Contains the project proof of concept.
- **mobile**: Contains the mobile client project.
- **www**: Contains the web client project.
- **server**: Contains the application server project.

## Proof of Concept

Since we have to implement `3` different frontends and `3` different backends,
the structure is as follows: www has 3 folders, one for each frontend, and the
same for the server.

```bash
demo/
├── README.md
├── www/
│   ├── react/
│   ├── angular/
│   └── vue/
└── server/
    ├── bun/
    ├── python/
    └── java/
```

## Application Features

1. **User Management**: Register, authenticate, and manage users via forms or
   OAuth2 (Google, Facebook, etc.).
2. **Services**: Users subscribe to and interact with various services (e.g.,
   Google, Dropbox).
3. **Actions**: Trigger conditions based on specific service events (e.g., new
   message, new file).
4. **REActions**: Execute tasks when an action is triggered (e.g., saving
   attachments to OneDrive).

## Work Group

- The project must be done in a **group**.
- Module validation will be based on both the quality and quantity of features.
- **Formulas** for minimum expected configuration in a group of **X** students:
  - **NBS** = Number of services supported by the application server.
  - **NBA** = Total number of Actions supported by all services and clients.
  - **NBR** = Total number of REActions supported by all services and clients.

### Expectations:

- **NBS ≥ 1 + X**
- **NBA + NBR ≥ 3 * X**

If one client (web or mobile) has fewer functions, calculations will be based on
the least functional client.

## System Architecture

- **Mobile Client**: Available on Android or Windows Mobile, forwards user
  requests to the server.
- **Web Client**: Functions similarly to the mobile client.
- **Application Server**: The core business logic, interfacing through a REST
  API.

## Project Construction

- **Technologies**: Docker Compose is recommended for setting up independent
  components (server, mobile client, web client).
- **Key Docker Requirements**:
  - `docker-compose.yml` includes services for the server, mobile, and web
    clients.
  - Validation through `docker-compose up`.

## Documentation & API

- Clear documentation required.
- Must include a `README.md` describing the application server API.
- Diagrams (class, sequence) encouraged for clarity.

## Project Timeline

1. **First Defense (Planning)**:
   - Experiment with technology stacks.
   - Separate tasks and schedule work.
   - Consider security and database design.
2. **Second Defense (Minimum Viable Product)**:
   - Core architecture implemented.
   - Planning adjusted to real progress.
3. **Final Defense (Final Product)**:
   - Complete with most features.
   - Presentation and analysis of development progress.

## References

- [IFTTT](https://ifttt.com)
- [Zapier](https://zapier.com)
- [OAuth Guide](https://fusionauth.io/articles/oauth/modern-guide-to-oauth)
