import { TypeOrmModuleOptions } from "@nestjs/typeorm";
import envConfig from "./env.config";

const typeOrmConfig: TypeOrmModuleOptions = {
  type: "postgres",
  host: envConfig.DB_Host,
  port: +envConfig.DB_Port,
  username: envConfig.DB_UserName,
  password: envConfig.DB_Password,
  database: envConfig.DB_Name,
  entities: [__dirname + "/../modules/**/entities/*.entity{.ts,.js}"],
  migrations: [__dirname + "/../migrations/*{.ts,.js}"],
  cli: {
    migrationsDir: "./src/migrations",
  },
  migrationsRun: false, // to automatically run migrations set it to true
  synchronize: false, //true if you want to create auto migrations
  // logging: ["query", "error"],
  // keepConnectionAlive: true
};
export default typeOrmConfig;
