var { execSync } = require('child_process');

const migrationName = process.argv[2]; // Accessing the argument passed from the command line

console.log('1', process.argv[1]);
console.log('2', process.argv[2]);
console.log('0', process.argv[0]);

const command = `npm run typeorm migration:create ./src/migrations/${migrationName}`;

try {
  execSync(command, { stdio: 'inherit' });
} catch (error) {
  console.error(error);
}
