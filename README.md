
# Roundhouse Volunteer Hub

Roundhouse Volunteer Hub is a web-based Volunteer Management
Platform designed to centralize volunteer management, event
organization, shift scheduling, participation tracking,
and internal communication.

The platform provides separate interfaces for staff members
and volunteers.

## Development Team

- Elio Abou Hanna
- Charbel Eid

## Project Status

Currently under active development.

The database architecture, authentication system,
authorization mechanisms, and initial security foundation
have been implemented and tested.

## Implemented Features

- Staff login and logout
- Volunteer login and logout
- Role-based access control
- Session-based authentication
- Password hashing with bcrypt
- Inactive volunteer account protection
- Automatic invalidation of unauthorized sessions
- Login rate limiting
- CSRF protection
- Login form validation and error messages
- Initial staff dashboard interface
- MySQL database with Sequelize migrations
- Automated authentication and security unit tests

## Planned Features

### Staff

- Volunteer management
- Volunteer account management
- Skills management
- Volunteer search and filtering
- Event management
- Shift scheduling
- Volunteer assignments
- Shift capacity management
- Volunteer hour tracking
- Participation history
- Announcement management
- Dashboard statistics and analytics

### Volunteers

- Personal dashboard
- View personal information
- View assigned shifts
- View volunteer hours
- View participation history
- Read announcements
- Change password

## Technologies

### Frontend

- HTML5
- CSS3
- JavaScript
- Tabler UI

### Backend

- Node.js
- Express.js
- Express Session
- bcrypt
- Express Rate Limit
- Node.js Crypto

### Database

- MySQL
- Sequelize ORM
- Sequelize CLI
- MySQL Workbench

### Development and Testing

- Git and GitHub
- Jira
- Scrum
- Postman
- Node.js Test Runner

## Architecture

The application follows a layered client-server
architecture.

- Frontend: user interface and interaction
- Routes: HTTP endpoint definitions
- Controllers: request handling
- Middleware: authentication, authorization and security
- Models: database entities and relationships
- Migrations: database structure and evolution
- Seeders: initial development data
- Tests: automated verification

## Database

The database contains 10 application tables:

- staff_users
- volunteers
- volunteer_accounts
- skills
- volunteer_skills
- events
- shifts
- shift_assignments
- volunteer_hours
- announcements

Sequelize migrations are the single source of truth
for the database structure.

The database EER diagram is available in the project root.

## Installation

### Prerequisites

- Node.js 24 or a compatible version
- npm
- MySQL Server
- Git

### 1. Clone the repository

    git clone https://github.com/elioabouhanna/roundhouse-volunteer-hub.git

    cd roundhouse-volunteer-hub/backend

### 2. Install dependencies

    npm ci

### 3. Configure environment variables

Create a .env file inside the backend directory using
.env.example as a template.

Configure the MySQL connection, session secret,
and initial development account credentials.

Never commit the .env file to GitHub.

A random session secret can be generated using:

    node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

### 4. Create and initialize the database

    npx sequelize-cli db:create --env development

    npx sequelize-cli db:migrate --env development

### 5. Create initial development accounts

For a fresh development database, run:

    npx sequelize-cli db:seed --seed 20261008193346-create-admin-user.js --env development

    npx sequelize-cli db:seed --seed 20261027204713-create-volunteer-account.js --env development

Account credentials are defined in the local .env file.

Do not rerun these seeders if the accounts already exist.

### 6. Start the application

    npm start

For development with automatic server restarts:

    npm run dev

Open the application at:

http://localhost:3000/login

## Automated Testing

Run the automated tests from the backend directory:

    npm test

The current test suite contains 24 unit tests covering:

- Staff authentication
- Volunteer authentication
- Invalid credentials
- Invalid request input
- Logout
- Role-based authorization
- Inactive volunteer account protection
- Session invalidation
- CSRF token generation
- CSRF token validation
- CSRF session isolation

These tests use simulated requests and database responses
without modifying the development database.

## Security

The application currently implements:

- bcrypt password hashing
- Role-based access control
- Session regeneration after authentication
- Session invalidation
- HTTP-only session cookies
- SameSite cookie protection
- Login rate limiting
- CSRF protection
- Environment-based credential management

Production session storage, HTTPS configuration,
and further security hardening will be addressed
before deployment.

## Project Management

The project follows the Scrum methodology.

Jira is used for product backlog management,
sprint planning and development tracking.

Git and GitHub are used for version control
and collaboration.

## Future Development

The next development stage focuses on volunteer
management, followed by event scheduling, assignments,
hour tracking, announcements and functional dashboards.

The final stages will include UI/UX refinement,
integration testing, deployment and documentation.
