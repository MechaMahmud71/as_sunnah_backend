import * as dotenv from "dotenv";
import { Config } from "./interface/config.interface";

dotenv.config();

export const config: Config = {
  port: parseInt(process.env.PORT, 10) || 3000,
  database: {
    host: process.env.DATABASE_HOST,
    port: parseInt(process.env.DATABASE_PORT, 10) || 5432,
    username: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    name: process.env.DATABASE_NAME,
    type: process.env.DATABASE_TYPE,
  },
  jwtSecret: process.env.JWT_SECRET,
  mailer: {
    host: process.env.MAILTRAP_HOST,
    port: parseInt(process.env.MAILTRAP_PORT, 10) || 587,
    username: process.env.MAILTRAP_USER,
    password: process.env.MAILTRAP_PASS,
    mailFrom: process.env.MAILER_MAIL_FROM,
  }
}

export default () => (config);
