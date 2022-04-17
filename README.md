# pt-coding-exercise

## Overview

This exercise aims to create a web application with a login page and a secure area and fetch data from an external API. The authentication should be handled with Json Web Tokens (JWT).

The following tools are mandatory for the development:

- Typescript
- React
- Redux

## Solution

This POC was built with [Next.js](https://nextjs.org/) framework. This tool allows us to mix the client and server sides in the same project and bring some tools to make easier the develoment.

| ![Sign in page!](/doc/images/signin.png) | ![Dashboard page!](/doc/images/dashboard.png) | ![Settings page!](/doc/images/settings.png) |
| ---------------------------------------- | --------------------------------------------- | ------------------------------------------- |
|  Sign in page                            |  Dashboard page                               | Settings page                               |

### Tools and libaries

- Typescript
- Nextjs
- Redux Toolkit
- Tailwindcss
- Jest
- Cypress

### Sign in and session

There are two mechanism for sing in users.

1. Email + password
2. Github account.

When a user is signed in successfully, the app generates a JWT token with some information related to the user and stores the token in an HTTP only cookie. That cookie is sent as part of the client's requests so that the server takes the responsibility of reading the cookie and verifying if the JWT token is valid and has not expired. It means that requests against secure endpoints/pages should be denied whether there is no cookie or the JWT token is not valid/expired.

On the other hand, the client relies on the app state to determine if the user is authenticated. When an authenticated user refreshes the web page, the app state gets initialized, so the user is signed out as there is no user info in the app state.

A hydration mechanism is in place to avoid this unexpected behaviour allowing authenticated users to keep their sessions open. The server will attach the user data, and the app state gets hydrated when the page is loaded.

### Fetching data

The app fetches data from GitHub Public API to retrieve public repositories and the own repositories of users if they sign in with a GitHub account. The app exposes an API that the client can consume to get the data from GitHub. The API verifies the user session (JWT token) and makes requests to GitHub.

In the case of refreshing the web page, the hydration mechanism hydrates the app state, bringing the data directly to the app state.
When the client does not have repositories data yet, it can request the API to get the data.

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

`NEXT_PUBLIC_CLIENT_ID_GITHUB` and `CLIENT_SECRET_GITHUB` are the `client_id` and `client_secret` of your GitHub app. If you don't have one yet, [register a new one](https://docs.github.com/en/rest/guides/basics-of-authentication#registering-your-app).

### Run

Using a terminal, run the following commands in the root of your project:

1. `yarn`
2. `yarn dev`

If you want to run in production mode run instead:

1. `yarn`
2. `yarn build`
3. `yarn start`

The app should be running now in `http://localhost:3000`

## Unit and e2e tests

Unit and e2e tests have been development. This GitHub repository is configure to run them. If you want to run them locally:

### Run unit tests

```
yarn test
```

### Run e2e tests

```
yarn e2e
```

_NOTE: The coverage of unit tests is very poor._

## Deployment

This repository is auto deployed in Vercel:

https://pt-coding-exercise.vercel.app/
