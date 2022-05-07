import { MysqlConnectionOptions } from 'typeorm/driver/mysql/MysqlConnectionOptions';

const userConfig: MysqlConnectionOptions = {
  type: 'mariadb',
  host: 'localhost',
  port: 3306,
  database: 'test',
  username: 'test',
  password: 'test',
  entities: ['dist/src/**/entities/*.entity.js'],
  synchronize: false,
  migrations: ['dist/src/db/migrations/*.js'],
  cli: {
    migrationsDir: 'src/db/migrations',
  },
};

const roomConfig: MysqlConnectionOptions = {
  type: 'mysql',
  host: 'localhost',
  port: 3306,
  database: 'test',
  username: 'test',
  password: 'test',
  entities: ['dist/src/**/entities/*.entity.js'],
  synchronize: false,
  migrations: ['dist/src/db/migrations/*.js'],
  cli: {
    migrationsDir: 'src/db/migrations',
  },
};

export default config;
