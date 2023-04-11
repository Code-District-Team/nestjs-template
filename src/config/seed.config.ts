import { DataSource, DataSourceOptions } from 'typeorm';
require('dotenv').config()

export const seedSourceOptions: DataSourceOptions = {
  type: 'postgres',
  host: process.env.DB_HOST,
  port: +process.env.DB_PORT,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: [__dirname + '/../modules/**/*.entity{.ts,.js}'],
  migrations: [__dirname + '/../seed/*{.ts,.js}'],
  migrationsRun: false, // to automatically run migrations set it to true
  synchronize: false, //true if you want to create auto migrations
  // logging: ["query", "error"],

  migrationsTableName: 'seeds',
};

const seedSource = new DataSource(seedSourceOptions);

export default seedSource;
