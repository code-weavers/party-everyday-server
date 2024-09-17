# Party Everyday

## Overview

This project is a NestJS-based application designed to handle various functionalities such as user management, party creation, and email notifications. It leverages several modules and services to provide a robust and scalable architecture.

## Features

### User Management

- **Create User**: Allows the creation of new users with email and password validation.
- **Authentication**: Uses JWT for secure authentication.
- **Password Encryption**: Utilizes bcrypt for password hashing.

### Party Management

- **Create Party**: Enables the creation of new parties with associated files and guest notifications.
- **File Upload**: Supports cloud-based file uploads.

### Email Notifications

- **Send Emails**: Uses Nodemailer to send emails with customizable templates.
- **Email Templates**: Supports HTML email templates for better formatting.

### Logging

- **Logger Module**: Provides logging capabilities for tracking application events.

### Configuration

- **Environment Config**: Manages application configuration through environment variables.

## Project Structure

```plaintext
.env
.env.example
.eslintrc.js
.gitignore
.prettierrc
.vscode/
    settings.json
coverage/
    clover.xml
    coverage-final.json
    lcov-report/
        base.css
        block-navigation.js
        index.html
        modules/
        prettify.css
        prettify.js
        services/
        sorter.js
    lcov.info
docker-compose.yml
nest-cli.json
package.json
pnpm-lock.yaml
README.md
src/
    app.module.ts
    common/
        core/
        ...
    config/
    entities/
    main.ts
    modules/
    services/
test/
    app.e2e-spec.ts
    jest-e2e.json
    unit/
tsconfig.build.json
tsconfig.json
```


## Installation

```bash
#Clone the repository:
$ git clone <repository-url>

#Install dependencies:
$ pnpm install
```

## Running the app

```bash
# development
$ pnpm run start

# watch mode
$ pnpm run start:dev

# production mode
$ pnpm run start:prod
```

## Test

```bash
# unit tests
$ pnpm run test

# e2e tests
$ pnpm run test:e2e

# test coverage
$ pnpm run test:cov
```