import { AdminGuard } from '@/guards/admin/admin.guard';
import { JwtGuard } from '@/guards/admin/jwt.guard';
// import { SerializeInterceptor } from '@/interceptors/serialize/serialize.interceptor';
import {
  Body,
  Controller,
  Get,
  Post,
  UseGuards,
  // UseInterceptors
} from '@nestjs/common';
import { Expose } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';
// import { Logs } from './logs.entity';
import { Serialize } from '@/decorators/serialize.decorator';

class LogsDto {
  @IsString()
  @IsNotEmpty()
  msg: string;

  @IsString()
  id: string;

  @IsString()
  name: string;
}

class PublicLogsDto {
  @Expose()
  msg: string;

  @Expose()
  name: string;
}

@Controller('logs')
@UseGuards(JwtGuard, AdminGuard)
// UserInterceptor(new SerializationInterceptor(DTO))
export class LogsController {
  @Get()
  getTest() {
    return 'test';
  }

  @Post()
  @Serialize(PublicLogsDto) //把结果进行序列化
  //@UseInterceptors(new SerializeInterceptor(Logs)) //后置拦截器
  postTest(@Body() dto: LogsDto) {
    console.log(
      '🚀 ~ file: logs.controller.ts:15 ~ LogsController ~ postTest ~ dto:',
      dto,
    );
    return dto;
  }
}
