<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg" alt="Donate us"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow" alt="Follow us on Twitter"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## API Routes

All routes are prefixed with the server origin (default `http://localhost:3000`) and use JSON unless noted as `multipart/form-data`. Routes marked **Auth** require a valid Better Auth session (sent as the session cookie/header); requests without one receive `401 Unauthorized`. Interactive documentation is available at `/api` (Swagger UI).

### App

| Method | Route | Auth | Description |
| --- | --- | --- | --- |
| GET | `/` | No | Health check. Returns a simple greeting from `AppService`. |

### Auth (`/auth`)

| Method | Route | Auth | Description |
| --- | --- | --- | --- |
| GET | `/auth` | Yes | List all users (`name`, `email`, `image`). |
| GET | `/auth/:id` | Yes | Get a single user by ID (`name`, `email`, `image`). Returns `404` if not found. |
| GET | `/auth/profile/:id` | Yes | Get a profile by profile ID, including its user and uploads (catalog items). |
| POST | `/auth/signup` | No | Create an account. Body: `name` (min 3 chars), `email`, `password` (6-20 chars), optional `rememberMe`. Returns `201 Created`. |
| POST | `/auth/signin` | No | Sign in with email and password. Body: `email`, `password`, optional `rememberMe`. Returns `200 OK`. |
| POST | `/auth/logout` | Yes | Sign the current user out and set the session-clearing `Set-Cookie` header. |
| PUT | `/auth/:id` | Yes | Update a profile (the `:id` is the profile ID). Optional body: `name`, `image`, `uploadName`, `description`, `price`, `currency`. User fields and upload fields are updated in a transaction. |
| DELETE | `/auth/:id` | Yes | Delete a user by ID. Returns `204 No Content` on success. |

### Store (`/store`)

Every route requires **Auth** and only operates on stores owned by the current user.

| Method | Route | Description |
| --- | --- | --- |
| POST | `/store` | Create a store for the current user. Body: `name`, `description`, `accountName`, `accountNumber`, `bank`, `rules` (string array). Returns `409` if the user already has a store. |
| GET | `/store` | List the current user's stores, sorted by name. |
| GET | `/store/:id` | Get one of the current user's stores by ID. Returns `404` if not found or not owned. |
| PUT | `/store/:id` | Update a store. Body accepts any subset of the create fields. |
| DELETE | `/store/:id` | Delete a store. Returns `{ "deleted": true }`. |

### Upload (`/upload`)

Catalog items. Every route requires **Auth**. Create/update use `multipart/form-data`.

| Method | Route | Description |
| --- | --- | --- |
| POST | `/upload` | Upload 1-10 files in the `files` field and create a catalog item. Body: `name` (string array), `price` (string array), `description`, `quantity`. Requires the user to have a currency set and a store created; files are uploaded to Cloudinary, then the DB record is created. Returns `400` if those prerequisites are missing. |
| GET | `/upload/:id` | Get a catalog item by ID (`name`, `description`, `price`, `currency`, `fileurl`, timestamps). Cached in Redis for 60 seconds. Returns `404` if not found. |
| PUT | `/upload/:id` | Replace the item's files (1-10 `files`) and optionally update `name`, `description`, `price`, `quantity`. Requires the user to have a currency set. |
| DELETE | `/upload/:id` | Delete a catalog item by ID. Returns `204 No Content`. |

### Media (`/media`)

Direct Cloudinary media management. Every route requires **Auth**.

| Method | Route | Description |
| --- | --- | --- |
| POST | `/media/upload` | Upload a single file in the `file` field (`multipart/form-data`). Images up to 10 MB, videos up to 100 MB; allowed types: JPEG, PNG, WebP, GIF, MP4, MOV, WebM. Returns the URL, public ID, format, dimensions/duration, and a thumbnail URL for videos. |
| POST | `/media/upload-many` | Upload up to 10 files in the `files` field (`multipart/form-data`). Returns an array of uploaded media. |
| DELETE | `/media` | Delete media from Cloudinary. Body: `publicId` and `resourceType` (`image` or `video`). |

### Generate URL (`/generate-url`)

| Method | Route | Auth | Description |
| --- | --- | --- | --- |
| POST | `/generate-url/generate-url` | Yes | Generate (or reuse) the public storefront URL for the current user's store. Requires `STOREFRONT_BASE_URL` to be configured and the user to have a store. Returns `storeId`, `publicId`, and `url`. |

### WebSocket events

Connect with Socket.IO and the same Better Auth session. The handshake headers are used to resolve the session; unauthenticated connections are rejected with `401 Unauthorized`.

| Event | Payload | Description |
| --- | --- | --- |
| `displays_prompt` | `{ prompt: string }` | Chat with the user's personal AI agent, which can manage their catalog and store via Mastra tools. |
| `createDashboard` | `{ prompt: string }` | Chat with the customer-care agent for the user's store (order-related assistance). Requires the user to have a store. |

> The `order`, `store-context`, and `database` modules currently register controllers but expose no HTTP routes.

## Project setup

```bash
$ pnpm install
```

## Compile and run the project

```bash
# development
$ pnpm run start

# watch mode
$ pnpm run start:dev

# production mode
$ pnpm run start:prod
```

## Run tests

```bash
# unit tests
$ pnpm run test

# e2e tests
$ pnpm run test:e2e

# test coverage
$ pnpm run test:cov
```

## Deployment

When you're ready to deploy your NestJS application to production, there are some key steps you can take to ensure it runs as efficiently as possible. Check out the [deployment documentation](https://docs.nestjs.com/deployment) for more information.

If you are looking for a cloud-based platform to deploy your NestJS application, check out [Mau](https://mau.nestjs.com), our official platform for deploying NestJS applications on AWS. Mau makes deployment straightforward and fast, requiring just a few simple steps:

```bash
$ pnpm install -g @nestjs/mau
$ mau deploy
```

With Mau, you can deploy your application in just a few clicks, allowing you to focus on building features rather than managing infrastructure.

## Observability

In production applications, observability is essential for understanding how your system behaves, detecting issues early, and maintaining reliable performance.

[NestJS Observe](https://observe.nestjs.com) automatically instruments your NestJS application, giving you deep visibility into your system with minimal setup:

- **Distributed tracing:** Follow requests across services and understand how they flow through your system.
- **Waterfall analysis:** Visualize request execution and identify slow operations, bottlenecks, and unexpected delays.
- **Performance analysis:** Analyze application performance in real time and quickly pinpoint areas that need optimization.
- **Metrics:** Track key application and infrastructure metrics to understand system health and performance trends.
- **Logging:** Centralize and correlate logs with traces and other telemetry to make debugging easier.
- **Error tracking:** Detect errors quickly and investigate their root causes with the surrounding context.
- **SLA monitoring:** Track service-level objectives and identify when your application is approaching or exceeding defined thresholds.
- **Alarms and alerts:** Set up alerts for critical errors, performance degradation, SLA violations, and other anomalies so your team can react quickly.

To add it to this project:

```bash
$ pnpm install @nestjs/observe
```

Then follow the [setup guide](https://docs.nestjs.com/observability/overview) - it takes a single import and an app key.

The free plan needs no payment details and covers 300,000 events a month. You can also browse the [live demo](https://www.observe-demo.nestjs.com/dashboard) first - the whole dashboard over a busy service's data, with nothing to install.

## Resources

Check out a few resources that may come in handy when working with NestJS:

- Visit the [NestJS Documentation](https://docs.nestjs.com) to learn more about the framework.
- For questions and support, please visit our [Discord channel](https://discord.gg/G7Qnnhy).
- To dive deeper and get more hands-on experience, check out our official video [courses](https://courses.nestjs.com/).
- Deploy your application to AWS with the help of [NestJS Mau](https://mau.nestjs.com) in just a few clicks.
- Auto-instrument your application with [NestJS Observe](https://observe.nestjs.com). Distributed tracing, metrics, and logging made easy. Error tracking and performance monitoring for your NestJS applications.
- Visualize your application graph and interact with the NestJS application in real-time using [NestJS Devtools](https://devtools.nestjs.com).
- Need help with your project (part-time to full-time)? Check out our official [enterprise support](https://enterprise.nestjs.com).
- To stay in the loop and get updates, follow us on [X](https://x.com/nestframework) and [LinkedIn](https://linkedin.com/company/nestjs).
- Looking for a job, or have a job to offer? Check out our official [Jobs board](https://jobs.nestjs.com).

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://twitter.com/kammysliwiec)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).
