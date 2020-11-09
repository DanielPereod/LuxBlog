import { MikroORM } from "@mikro-orm/core";
import path from "path";
import dotenv from "dotenv";
import { User } from "./entities/User";

dotenv.config();
export default {
  migrations: {
    path: path.join(__dirname + "/migrations"),
    pattern: /^[\w-]+\d+\.[tj]s$/,
  },
  entities: [User],
  dbName: process.env.PG_NAME,
  user: process.env.PG_USER,
  password: process.env.PG_PASSWORD,
  type: "postgresql",
  debug: process.env.PROD,
} as Parameters<typeof MikroORM.init>[0];
