# lego-webapp

> Open source frontend for abakus.no

[![MIT](https://badgen.net/badge/license/MIT/blue)](https://en.wikipedia.org/wiki/MIT_License) [![last commit](https://badgen.net/github/last-commit/webkom/lego-webapp/)](https://github.com/webkom/lego-webapp/commits/master) [![coontibutors](https://badgen.net/github/contributors/webkom/lego-webapp)](https://github.com/webkom/lego-webapp/graphs/contributors) [![Build Status](https://ci.webkom.dev/api/badges/webkom/lego-webapp/status.svg)](https://ci.webkom.dev/webkom/lego-webapp)

> **Issues**: We track issues in the main repo of LEGO

[![open issues](https://badgen.net/github/open-issues/webkom/lego)](https://github.com/webkom/lego/issues)

## Quick access

1. [Quick Start](#quick-start)
2. [LEGO-BRICKS](#lego-bricks)
3. [Development](#development)
4. [Deployment (webkom/lego#deployment)](https://github.com/webkom/lego#deployment)

## Quick Start

> For all the alternative ways to run the project, you will need to run `yarn build` to compile [lego-bricks](#lego-bricks) the first time you run the project. After this, it will build automatically when changed.

```bash
$ yarn # Install dependencies
$ yarn build # Compile LEGO-BRICKS - only required the first time you run the project
$ yarn start:staging # Start webserver with development backend
```

Everything should be up and running on [localhost:3000](http://localhost:3000). The `:staging` suffix points the webserver at a hosted development backend.

### Running with local backend

First, you need to have the `django` backend running, see [webkom/lego](https://github.com/webkom/lego).

```bash
$ yarn start # Start webserver with local backend
```

### Server side rendering (Optional)

In production (live) we use server side rendering. Due to bad hot reloading, we don't use it by default in dev. The server side renderer can be started by running:

```bash
$ yarn build
$ yarn ssr # or yarn ssr:staging
```

### Environment Variables

The `webserver` running the frontend can take many optional environment variables. Docs can be found at `config/environment.md`, and default can be found at `server/env.ts` and `config/env.ts`.

## LEGO-BRICKS

To facilitate using components from LEGO-WEBAPP in other projects, certain components have been split out to a separate package — LEGO-BRICKS. That package is stored within this repo, under `/packages/lego-bricks`.

The current build structure requires that `lego-bricks` be compiled to run the project, which can be done either by running `yarn build` in the root directory, or by navigating to the package and running the same command there.

## Development

We use some conventions and tools for our JavaScript/React development.

- [prettier](https://github.com/prettier/prettier) for JS code formatter.
  - `yarn prettier`
- [eslint](https://eslint.org/) for finding and fixing problems in your JavaScript code.
  - `yarn lint`
- [TypeScript](https://www.typescriptlang.org) for type checking.
  - `yarn types`

We recommend getting plugins/extensions in `VSCode` or `Vim` so the code auto-formats, and automatically prompts you with errors. When you submit code to Github the CI server will automatically run all the commands above to check that your code is up to par.

<details><summary><code>Unit tests</code></summary>

### Unit tests (jest)

Run all the tests and check for lint errors with the command:

```bash
$ yarn test
```

For development you can run the tests continuously by using:

```bash
$ yarn test:watch
```

A coverage report can be generated by running `yarn test -- --coverage`.

</details>

<details><summary><code>Cypress E2E (End-to-end tests)</code></summary>

### End to end tests (cypress)

In order to run end to end tests, you need to run both lego-webapp and lego.
Lego can be found here: https://github.com/webkom/lego. Lego is assumed to have a clean development database, follow the steps below to achieve that.

#### Backend

```bash
$ cd ../lego
$ docker compose up -d # Start all services that lego depends on
$ python manage.py initialize_development # Initialize and load data sources (postgres)
$ docker compose restart lego_cypress_helper # The cypress helper resets database between every test and might need this restart to function correctly
$ python manage.py runserver
```

> If you already have the backend setup, make sure your database is clean

```bash
python manage.py reset_db
python manage.py migrate
python manage.py load_fixtures
docker compose restart lego_cypress_helper # Make sure the copy is of the clean database
```

#### Frontend

Start up the node server

```bash
$ yarn start
```

And start cypress in another terminal

```bash
$ yarn cypress open
```

**Alternative:** You can also run the node server with server side rendering enabled. This is how the tests are run on CI. To do this, you build and start the server

```bash
$ yarn build
$ yarn ssr
```

And you run cypress headlessly (no visible browser) in another terminal

```bash
yarn cypress run
```

#### STRIPE

In order to run the payment end-2-end tests, a few extra steps are required. First one has to install the stripe cli, log in and then run

```bash
$ stripe listen --forward-to localhost:8000/api/v1/webhooks-stripe/
```

In addition, the backend needs to run with two environment variables.

```bash
$  STRIPE_WEBHOOK_SECRET=<SECRET> STRIPE_TEST_KEY=<SECRET> python manage.py runserver
```

The webhook is obtained when running the stripe command above, while the test key can be obtained from the stripe dashboard.

Lastly, one has to run the frontend without captcha:

```bash
$ SKIP_CAPTCHA=TRUE yarn start
```

</details>

<details><summary><code>Debugging</code></summary>

### Debugging

To debug chunk size (size of the javascript sent to the browser), run

```bash
$ BUNDLE_ANALYZER=true yarn build
```

</details>

<details><summary><code>CI/CD</code></summary>

### CI/CD

We use [drone](https://drone.io) as our CI/CD system. The server runs at https://ci.webkom.dev. This
repo is public, so anyone can see the status at https://ci.webkom.dev/webkom/lego-webapp.

Since the repo is public and we use a lot of secrets in the pipeline, we require the pipeline to be
verified with a signature from drone. To obtain this, use the [cli](https://docs.drone.io/cli):

```sh
drone sign webkom/lego-webapp
```

You need to login to retrieve the signature. Get the login data from your [user
settings](https://ci.webkom.dev/account).

</details>
