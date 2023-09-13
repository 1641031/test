import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { Logs } from 'src/logs/logs.entity';
import { Roles } from 'src/roles/roles.entity';
import { Profile } from 'src/user/profile.entity';
import { User } from 'src/user/user.entity';

export default {
  type: 'mysql',
  host: '127.0.0.1',
  port: 3306,
  username: 'root',
  password: 'example',
  database: 'testdb',
  entities: [User, Profile, Roles, Logs],
  // 同步本地的 schema 与 数据库 -> 初始化的时候去使用
  synchronize: true,
  // logging: process.env.NODE_ENV === 'development', // 在开发情况下才用它
  // logging: ['error'],
  logging: false,
} as TypeOrmModuleOptions;

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
