var { execSync } = require('child_process');
const seederName = process.argv[2]; // Accessing the argument passed from the command line

const seedercommand = `npm run typeorm migration:create ./src/seed/${seederName}`;

try {
  execSync(seedercommand, { stdio: 'inherit' });
} catch (error) {
  console.error(error);
}
