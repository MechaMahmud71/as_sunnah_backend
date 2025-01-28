export interface DatabaseConfig {
  host: string;
  port: number;
  username: string;
  password: string;
  name: string;
  type: string;
}

export interface Config {
  port: number;
  database: DatabaseConfig;
  jwtSecret: string;
  mailer: {
    host: string;
    port: number;
    username: string;
    password: string;
    mailFrom: string;
  }
}