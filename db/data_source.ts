import { DataSource, DataSourceOptions } from 'typeorm';
import * as dotenv from 'dotenv';

dotenv.config();

export const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  host: process.env.DATABASE_HOST,
  port: parseInt(process.env.DATABASE_PORT),
  username: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  entities: ['dist/**/*.entity.js'], // Automatically load entities
  synchronize: false,
  migrations: ['dist/db/migrations/*.js'],
  extra: {
    decimalNumbers: true,
  },
  logging: false
};

const dataSource = new DataSource(dataSourceOptions);

export default dataSource;
