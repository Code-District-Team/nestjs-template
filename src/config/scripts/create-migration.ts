var { execSync } = require('child_process');

const migrationName = process.argv[2]; // Accessing the argument passed from the command line

const command = `npm run typeorm migration:create ./src/migrations/${migrationName}`;

try {
  execSync(command, { stdio: 'inherit' });
} catch (error) {
  console.error(error);
}
