import { Global, Logger, Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { ConfigModule } from '@nestjs/config';
import * as dotenv from 'dotenv';
import * as Joi from 'joi';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LogsModule } from './logs/logs.module';
import { RolesModule } from './roles/roles.module';

// ConfigModule.forRoot() 可以读取 .env 文件

import { connectionParams } from 'ormconfig';
// import { ConfigEnum } from './enum/config.enum';
// import { Logs } from 'src/logs/logs.entity';
// import { Roles } from 'src/roles/roles.entity';
// import { Profile } from 'src/user/profile.entity';
// import { User } from 'src/user/user.entity';

// import Configuration from './configuration';
// 取决于命令行命令所带的字符 prod or dev??
const envFilePath = `.env.${process.env.NODE_ENV || `development`}`;

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath,
      load: [() => dotenv.config({ path: '.env' })],
      // load: [Configuration],
      validationSchema: Joi.object({
        NODE_ENV: Joi.string()
          .valid('development', 'production')
          .default('development'),
        DB_PORT: Joi.number().default(3306),
        DB_URL: Joi.string().domain(),
        DB_HOST: Joi.string().ip(),
        DB_TYPE: Joi.string().valid('mysql', 'postgres'),
        DB_DATABASE: Joi.string().required(),
        DB_USERNAME: Joi.string().required(),
        DB_PASSWORD: Joi.string().required(),
        DB_SYNC: Joi.boolean().default(false),
      }),
    }),
    TypeOrmModule.forRoot(connectionParams),
    // TypeOrmModule.forRootAsync({
    //   imports: [ConfigModule],
    //   inject: [ConfigService],
    //   useFactory: (configService: ConfigService) =>
    //     ({
    //       type: configService.get(ConfigEnum.DB_TYPE),
    //       host: configService.get(ConfigEnum.DB_HOST),
    //       port: configService.get(ConfigEnum.DB_PORT),
    //       username: configService.get(ConfigEnum.DB_USERNAME),
    //       password: configService.get(ConfigEnum.DB_PASSWORD),
    //       database: configService.get(ConfigEnum.DB_DATABASE),
    //       entities: [User, Profile, Logs, Roles],
    //       // 同步本地的 schema 与 数据库 -> 初始化的时候去使用
    //       synchronize: configService.get(ConfigEnum.DB_SYNC),
    //       // logging: process.env.NODE_ENV === 'development', // 在开发情况下才用它
    //       // logging: ['error'],
    //       logging: false,
    //     }) as TypeOrmModuleOptions,
    // }),
    UserModule,
    LogsModule,
    RolesModule,
  ],
  controllers: [],
  providers: [Logger],
  exports: [Logger],
})
export class AppModule {}
