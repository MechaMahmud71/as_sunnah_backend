# NestJS Application Deployment Guide

This README provides a comprehensive guide to deploying a NestJS application in a production environment.

---

## Prerequisites

Before deploying the application, ensure the following requirements are met:

1. **Node.js**: Install Node.js (v16.x or higher).
2. **Nest CLI**: Install the NestJS CLI globally: `npm install -g @nestjs/cli`
3. **Database**: Set up the required database (e.g., PostgreSQL) and ensure its credentials are available.
4. **Environment Variables**: Prepare the `.env` file with necessary configurations (e.g., database credentials, API keys, etc.).
5. **Package Manager**: Use either `npm` or `yarn`.


## Deployment Steps

### 1. Clone the Repository

Clone your application repository from the version control system:
```bash
git clone https://github.com/MechaMahmud71/as_sunnah_backend.git
```

### 2. Install Dependencies

Install the necessary dependencies:
```bash
npm install -f
```

### 3. Configure Environment Variables

Create a `.env` file in the root directory (if not already present) and add all the required environment variables. Example:
```env
ENV: development 
JWT_SECRET: Allahu_Akbar
DATABASE_HOST: localhost
DATABASE_PORT: 5432
DATABASE_USERNAME: postgres
DATABASE_PASSWORD: postgres
DATABASE_NAME: postgres
DATABASE_TYPE: postgres
MAILTRAP_HOST: sandbox.smtp.mailtrap.io
MAILTRAP_PORT: 2525
MAILTRAP_USER: 588cd2495e2e71
MAILTRAP_PASS: 97da9427f34fea
MAILER_MAIL_FROM: "No Reply <noreply@example.com>"
```

### 4. Build the Application

Compile the TypeScript code into JavaScript:
```bash
npm run build
```

### 5. Run Migrations (if applicable)

If your application uses a database with migrations, apply them before starting the application:
```bash
npm run typeorm

run migration:generate -- db/migrations/new_migrations

npm run migration:run

npm run seed
```

### 6. Start the Application

#### Development Mode
```bash
npm run start:dev
```

#### Production Mode
Ensure the application runs in production mode with compiled JavaScript:
```bash
npm run start:prod
```

---

## Admin and User Credentials

Below are the default credentials for accessing the application:

### Admin Account
- **Email**: `admin@admin.com`
- **Password**: `12345678`

### User Account
- **Email**: `faruk@test.com`
- **Password**: `12345678`


---


