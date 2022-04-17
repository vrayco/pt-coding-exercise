# pt-coding-exercise

## Overview

This exercise aims to create a web application with a login page and a secure area and fetch data from an external API. The authentication should be handled with Json Web Tokens (JWT).

The following tools are mandatory for the development:

- Typescript
- React
- Redux

## Solution

This proof of concept (POC) is based on [Next.js](https://nextjs.org/) framework. This tool allows us to mix the client and server sides in the same project and it brings some tools to make easier the develoment process.

### Screenshots

| ![Sign in page!](/doc/images/signin.png) | ![Dashboard page!](/doc/images/dashboard.png) | ![Settings page!](/doc/images/settings.png) |
| ---------------------------------------- | --------------------------------------------- | ------------------------------------------- |
|  Sign in page                            |  Dashboard page                               | Settings page                               |

### Tools and libaries used

- Typescript
- Nextjs
- Redux Toolkit
- Tailwindcss
- Jest
- Cypress

### Sign in and session

Users can sign in using two different mechanism:

1. Credentials (Email + password).
2. With a Github account.

When a user signs in successfully, the app generates a JWT token with related user information, which is stored in an HTTP only cookie. The client will send that cookie as part of the requests, and the server will read it and verify if the JWT token is valid and not expired. It means that requests against secure endpoints/pages should be denied whether there is no cookie or the JWT token is not valid/expired.

On the other hand, the client relies on the app state to determine if the user is authenticated. As we can figure out with this approach, the user's session is not correctly handled between page refreshes because the app state is lost when the page gets refreshed. So, an authenticated user will lose the session as soon as the user refreshes the web page. A hydration mechanism is in place to avoid this unexpected behaviour. The server consumes the cookie from the request and attaches the user info in the response. Later, the client hydrates the app state using that information before rendering any component.

### Fetching data

The app exposes some API endpoints that the client uses to retrieve the data from the GitHub API. Those endpoints are restricted to authenticated users. So, the API verifies the JWT token stored in the cookie before requesting the data to GitHub.

The hydration mechanism also hydrates that data, so the client does not need to call the API when refreshing the web page.

## Setting up the project

### System Requirements

- Node.js 12.22.0 or later
- yarn

### Clone the repository

Clone this repository in your local machine.

```
https://github.com/rvgonzalez/pt-coding-exercise.git
```

### Enviroment vars

Create `.env` file in the root of the project with the following variables (set your own values):

```
JWT_SECRET_KEY=
NEXT_PUBLIC_CLIENT_ID_GITHUB=
CLIENT_SECRET_GITHUB=
```

`NEXT_PUBLIC_CLIENT_ID_GITHUB` and `CLIENT_SECRET_GITHUB` are the `client_id` and `client_secret` of an GitHub app. A GitHub app is required in order to use the GitHub sign in. Create a new one app following [this document](https://docs.github.com/en/rest/guides/basics-of-authentication#registering-your-app). The value for `Authorization callback URL` is the base url of the project (For example: `http://localhost:3000`).

### Run

Using a terminal, run the following commands from the root of your project:

1. `yarn`
2. `yarn dev`

If you want to run in production mode:

1. `yarn`
2. `yarn build`
3. `yarn start`

Now, the app should be running at `http://localhost:3000`.

## Unit and e2e tests

This GitHub repository is configured to run the suite of tests automatically. See in instructions below, if you want to run them locally:

### Run unit tests

```
yarn test
```
_**Note**: The coverage of unit tests is very poor and should be improved at some point._

### Run e2e tests

```
yarn e2e
```

## Deployment

The `main` branch is auto deploy using Vercel platform. It is accessible in the url below:

https://pt-coding-exercise.vercel.app/

### Dummy data

Two users are prepopulated in the "database".
| Email | Password |
| ----- | -------- |
| juan@example.dev | pass |
| alejandra@example.dev | pass |

## Notes

- This project does not use a real database instead a JSON file is created (`/tmp/pt-coding-exercise-users.json`).
