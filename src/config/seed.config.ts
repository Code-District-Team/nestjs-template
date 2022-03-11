import { TypeOrmModuleOptions } from "@nestjs/typeorm";
console.log(process.env.BACKEND_PORT)

const seedConfig: TypeOrmModuleOptions = {
  type: "postgres",
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  entities: [__dirname + "/../modules/**/*.entity{.ts,.js}"],
  migrations: [__dirname + "/../seed/*{.ts,.js}"],
  cli: {
    migrationsDir: "./src/seed",
  },
  migrationsRun: false, // to automatically run migrations set it to true
  synchronize: false, //true if you want to create auto migrations
  migrationsTableName: "seed",
};
export default seedConfig;
