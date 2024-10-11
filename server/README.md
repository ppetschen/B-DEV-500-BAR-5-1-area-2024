# server

> [!WARNING]
> This is a work in progress, expect breaking changes without notice.

## architecture

This project follows a Microservices architecture, where each service is a
separate project. The services are:

### api-gateway

The API Gateway is the entry point for all requests. It is responsible for
routing requests to the appropriate service. It also handles authentication and
authorization. It is the only service that is exposed to the outside world.

We will use [Kong](https://github.com/Kong/kong) as the API Gateway.

### user-management

The User Management service is responsible for managing the user lifecycle. This
includes registration, authentication and access control. It also manages user
sessions, tokens and roles.

We will use [Keycloak](https://www.keycloak.org/) as the User Management
service.

### service-management

The Service Management service is responsible for the integration of external
services. It allows users to subscrive to third-party services, and manages the
tokens for these services. It also manages the lifecycle of these services.

We will use [Passport](https://github.com/jaredhanson/passport) for
authentication and authorization.

### action

The Action service is responsible for executing and triggering actions. These
could be anything from sending an email to uploading a file. It monitors the
external services and initiates actions when certain conditions are met.

We will use [RabbitMQ](https://github.com/rabbitmq) as our message broker.

### reaction

The Reaction service is responsible for performing reactions to actions after an
Action has been executed. It could be sending a notification to the user or
updating a database. It is a counterpart to the Action service.

We will use [BullMQ](https://github.com/taskforcesh/bullmq) to manage jobs,
delayed tasks and cron jobs.

### area-composition

The Area Composition service is responsible for composing the logic of how areas
are composed. This is where users define custom workflows and logic. This
service ensures that the logic is executed in the correct order and that the
correct actions and reactions are triggered.

We will use [temporal.io](https://github.com/temporalio) to manage the workflow
and orchestration.

### notification

The Notification service is responsible for sending notifications to users when
important events occur. It could be an email, a push notification or an SMS.
This could be when an action is executed or when a reaction is triggered, or
when a service is about to expire.

We will use tools like [Twilio](https://www.twilio.com/),
[Postal](https://github.com/postalserver/postal) as our notification service.

### monitoring

The Monitoring service is responsible for monitoring the health of the system.
It collects metrics, logs and traces from all the services and provides a
dashboard for the system administrators.

We will use [Prometheus](https://github.com/prometheus/prometheus) for metrics,
[Grafana](https://github.com/grafana/grafana) for dashboards and
[Jaeger](https://github.com/jaegertracing/jaeger) for tracing.

### database

The Database service is responsible for managing the database. It is a shared
service that manages all the storage of user data, service subscriptions, logs,
and actions and reactions.

We will use [PostgreSQL](https://www.postgresql.org/) as our primary database,
and [Redis](https://redis.io/) and [MongoDB](https://www.mongodb.com/) as our
secondary databases.

## deployment

We will use [Kubernetes](https://kubernetes.io/) for deployment. Each service
will be deployed as a separate pod, and will be managed by Kubernetes. We will
use [Helm](https://helm.sh/) for managing the deployments.
