import { TypeOrmModuleOptions } from "@nestjs/typeorm";

const typeOrmConfig: TypeOrmModuleOptions = {
  type: "postgres",
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  entities: [__dirname + "/../modules/**/*.entity{.ts,.js}"],
  migrations: [__dirname + "/../migrations/*{.ts,.js}"],
  cli: {
    migrationsDir: "./src/migrations",
  },
  migrationsRun: false, // to automatically run migrations set it to true
  synchronize: false, //true if you want to create auto migrations
  // logging: ["query", "error"],
};
export default typeOrmConfig;
