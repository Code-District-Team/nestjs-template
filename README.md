# NestJS API Template

<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

A robust NestJS-based API template with comprehensive features including:

- 🔐 Authentication & Authorization with JWT
- 👥 Multi-tenant architecture
- 💳 Stripe integration for payments (API v2023-10-16)
- 📄 Swagger API documentation
- 📨 Email service with Handlebars templates
- 🎨 Branding customization per tenant
- 🏢 Role-based access control (RBAC)
- 💾 PostgreSQL database with TypeORM
- 🔄 Database migrations and seeding
- 🎯 Request validation using class-validator
- 🚀 Docker support
- 📊 PDF generation
- 🗃️ CSV import/export capabilities
- ⚡ Cache manager integration
- 🔍 Global query scopes
- 📝 Comprehensive logging

## Prerequisites

Make sure the following are installed on your local machine:

1. **nvm (Node Version Manager)** - Install it from the [official nvm repository](https://github.com/nvm-sh/nvm).
2. **PostgreSQL** - Version 13.x or higher [Download](https://www.postgresql.org/)
3. **Git** - Version control system [Download](https://git-scm.com/)
4. **Docker** (optional) - For containerized deployment [Download](https://www.docker.com/)

### Installing Node.js with nvm

1. Install nvm:
   ```bash
   curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.5/install.sh | bash
   ```
   Or, for systems using `wget`:
   ```bash
   wget -qO- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.5/install.sh | bash
   ```

2. Close and reopen your terminal, or run:
   ```bash
   source ~/.bashrc
   ```
   (Or `.zshrc`, `.bash_profile`, depending on your shell).

3. Install Node.js (LTS version):
   ```bash
   nvm install 18
   ```

4. Set the installed version as the default:
   ```bash
   nvm use 18
   nvm alias default 18
   ```

5. Verify the installation:
   ```bash
   node -v
   npm -v
   ```

---

## Cloning the Repository

1. Open your terminal or command prompt.
2. Navigate to the directory where you want to clone the repository.
3. Run the following command:
   ```bash
   git clone <repository-url>
   ```
4. Navigate into the project directory:
   ```bash
   cd nestjs-template
   ```

## Installing Dependencies

Run the following command in the project directory to install all required dependencies:

   ```
   npm install
   ```

---

## Setting up Environment Variables

1. Copy the example environment file:
   ```bash
   cp .env.example .env
   ```
2. Open the `.env` file in your preferred text editor.
3. Update the environment variables as needed, such as database credentials, API keys, etc.
   Example:
   ```env
   DATABASE_HOST=localhost
   DATABASE_PORT=5432
   DATABASE_USER=your_username
   DATABASE_PASSWORD=your_password
   DATABASE_NAME=your_database
   ```

---

## Running the Application

To start the application in development mode, run:

   ```
   npm run start:dev
   ```

Verify that the application is running by opening your browser and navigating to:
```
http://localhost:3000
```

---

## Testing

Run the following commands to execute the tests:

- **Unit Tests**:
  ```bash
  npm run test
  ```

- **End-to-End Tests**:
  ```bash
  npm run test:e2e
  ```

---

## Linting and Formatting

- To lint the code, run:
  ```bash
  npm run lint
  ```

- To format the code, run:
  ```bash
  npm run format
  ```

---

## Useful Commands

- Start the application in production mode:
  ```bash
  npm run start:prod
  ```

- Generate a new module:
  ```bash
  nest generate module <module-name>
  ```

- Generate a new controller:
  ```bash
  nest generate controller <controller-name>
  ```

- Generate a new service:
  ```bash
  nest generate service <service-name>
  ```

---

## Contributing

1. Fork the repository.
2. Create a new branch:
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. Commit your changes:
   ```bash
   git commit -m "Add your message here"
   ```
4. Push to your branch:
   ```bash
   git push origin feature/your-feature-name
   ```
5. Open a Pull Request on the main repository.

---

## License

This project is licensed under the [MIT License](LICENSE).