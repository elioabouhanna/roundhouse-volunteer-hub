
# Database

Roundhouse Volunteer Hub uses MySQL with Sequelize ORM.

## Database Structure

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

## Database Setup

Sequelize migrations are the single source of truth
for the database structure.

From the backend directory, run:

    npx sequelize-cli db:create --env development
    npx sequelize-cli db:migrate --env development

To verify migration status, run:

    npx sequelize-cli db:migrate:status --env development

Database credentials are configured in backend/.env.

See backend/.env.example for the required variables.

## Database Documentation

The MySQL Workbench EER model and database schema
image are available in the project root.

All future database changes must be implemented
through Sequelize migrations.
