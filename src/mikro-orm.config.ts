import { Options } from "@mikro-orm/core";
import { __prod__ } from "./constants";
import { Post } from "./entities/Post";
import path from "path";
console.log("process.env.DB_NAME", process.env.DB_NAME);
import { config } from "dotenv";
config();

const mikroConfig: Options = {
  migrations: {
    path: path.join(__dirname, "./migrations"),
    pattern: /^[\w-]+\d+\.[tj]s$/,
  },
  entities: [Post],
  dbName: process.env.DB_NAME!,
  user: process.env.DB_USERNAME!,
  password: process.env.DB_PASSWORD!,
  type: "postgresql",
  debug: !__prod__,
};
export default mikroConfig;
