import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { WinstonModule, WinstonModuleOptions, utilities } from 'nest-winston';
import * as winston from 'winston';
import { Console } from 'winston/lib/winston/transports';
import * as DailyRotateFile from 'winston-daily-rotate-file';
import { LogEnum } from '../enum/config.enum';

function createDailyRotateTrasnport(level: string, filename: string) {
  return new DailyRotateFile({
    level,
    dirname: 'logs',
    filename: `${filename}-%DATE%.log`,
    datePattern: 'YYYY-MM-DD-HH',
    zippedArchive: true,
    maxSize: '20m',
    maxFiles: '14d',
    format: winston.format.combine(
      winston.format.timestamp(),
      winston.format.simple(),
    ),
  });
}

@Module({
  imports: [
    WinstonModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (ConfigService: ConfigService) => {
        const consoleTransports = new Console({
          level: 'info',
          format: winston.format.combine(
            winston.format.timestamp(),
            utilities.format.nestLike(),
          ),
        });

        // const dailyTransports = new DailyRotateFile({
        //   level: 'warn',
        //   dirname: 'logs',
        //   filename: 'application-%DATE%.log',
        //   datePattern: 'YYYY-MM-DD-HH',
        //   zippedArchive: true,
        //   maxSize: '20m',
        //   maxFiles: '14d',
        //   format: winston.format.combine(
        //     winston.format.timestamp(),
        //     winston.format.simple(),
        //   ),
        // });

        // const dailyInfoTransports = ;
        console.log(ConfigService.get(LogEnum.LOG_ON));
        return {
          transports: [
            consoleTransports,
            ...(ConfigService.get(LogEnum.LOG_ON)
              ? [
                  createDailyRotateTrasnport('info', 'application'),
                  createDailyRotateTrasnport('warn', 'error'),
                ]
              : []),
          ],
        } as WinstonModuleOptions;
      },
    }),
  ],
})
export class LogsModule {}
