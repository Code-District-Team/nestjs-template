var { execSync } = require('child_process');

const generatedMigration = process.argv[2]; // Accessing the argument passed from the command line

const generateCommand = `npm run typeorm -- migration:generate -d ./src/config/typeorm.config.ts ./src/migrations/${generatedMigration}`;

try {
  execSync(generateCommand, { stdio: 'inherit' });
} catch (error) {
  console.error(error);
}
