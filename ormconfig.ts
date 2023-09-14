import { TypeOrmModuleOptions } from '@nestjs/typeorm';
// import { Logs } from './src/logs/logs.entity';
// import { Roles } from './src/roles/roles.entity';
// import { Profile } from './src/user/profile.entity';
// import { User } from './src/user/user.entity';
import { DataSource, DataSourceOptions } from 'typeorm';
import * as fs from 'fs';
import * as dotenv from 'dotenv';
import { ConfigEnum } from './src/enum/config.enum';

// 通过环境变量读取不同的 .env文件
function getEnv(env: string): Record<string, unknown> {
  if (fs.existsSync(env)) {
    return dotenv.parse(fs.readFileSync(env));
  }
  return {};
}

// 通过 dotENV 来解析不同的配置文件
function buildConnectionOptions() {
  const defaultConfig = getEnv('.env');
  const envConfig = getEnv(`.env.${process.env.NODE_ENV || 'development'}`);
  // configService
  const config = { ...defaultConfig, ...envConfig };

  // 读取所有目录下 所有包含 entity.ts 或 .js的文件
  const entitiesDir =
    process.env.NODE_ENV === 'test'
      ? [__dirname + '/**/*.entity.ts']
      : [__dirname + '/**/*.entity{.js,.ts}'];
  return {
    type: config[ConfigEnum.DB_TYPE],
    host: config[ConfigEnum.DB_HOST],
    port: config[ConfigEnum.DB_PORT],
    username: config[ConfigEnum.DB_USERNAME],
    password: config[ConfigEnum.DB_PASSWORD],
    database: config[ConfigEnum.DB_DATABASE],
    entities: entitiesDir,
    // 同步本地的 schema 与 数据库 -> 初始化的时候去使用
    synchronize: true,
    // logging: process.env.NODE_ENV === 'development', // 在开发情况下才用它
    // logging: ['error'],
    logging: false,
  } as TypeOrmModuleOptions;
}

export const connectionParams = buildConnectionOptions();

export default new DataSource({
  ...connectionParams,
  migrations: ['src/migrations/**'],
  subscribers: [],
} as DataSourceOptions);

// export default {
//   type: 'mysql',
//   host: '127.0.0.1',
//   port: 3306,
//   username: 'root',
//   password: 'example',
//   database: 'testdb',
//   entities: [User, Profile, Roles, Logs],
//   // 同步本地的 schema 与 数据库 -> 初始化的时候去使用
//   synchronize: true,
//   // logging: process.env.NODE_ENV === 'development', // 在开发情况下才用它
//   // logging: ['error'],
//   logging: false,
// } as TypeOrmModuleOptions;

// export default {
//   type: 'mysql',
//   host: '127.0.0.1',
//   port: 3306,
//   username: 'root',
//   password: 'example',
//   database: 'testdb',
//   entities: [User, Profile, Roles, Logs],
//   // 同步本地的 schema 与 数据库 -> 初始化的时候去使用
//   synchronize: true,
//   // logging: process.env.NODE_ENV === 'development', // 在开发情况下才用它
//   // logging: ['error'],
//   logging: false,
// } as TypeOrmModuleOptions;
