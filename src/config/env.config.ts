const envConfig = {
  frontendHost: process.env.FRONTEND_HOST,
  frontendPort: process.env.FRONTEND_PORT,
  backendHost: process.env.BACKEND_HOST,
  backendPort: process.env.BACKEND_PORT,
  mailImagePath: "/password-reset.jpg",
  contactUsEmail: process.env.CONTACT_US_EMAIL,
  smtpEmail: process.env.SMTP_EMAIL,
  smtpKey: process.env.SMTP_KEY,
  DB_Host: process.env.DB_Host,
  DB_Port: process.env.DB_Port,
  DB_UserName: process.env.DB_UserName,
  DB_Password: process.env.DB_Password,
  DB_Name: process.env.DB_Name,
  AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID,
  AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY,
  AWS_REGION: process.env.AWS_REGION,
  AWS_BUCKET: process.env.AWS_BUCKET,
};
export default envConfig;

//npx typeorm migration:create -n  [Name] -d src/migrations
