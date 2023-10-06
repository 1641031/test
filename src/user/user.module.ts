import { Global, Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Logs } from '../logs/logs.entity';
import { Roles } from '../roles/roles.entity';

@Global() // 可以让 user 里面的内容被其他 模块引用。
@Module({
  imports: [TypeOrmModule.forFeature([User, Logs, Roles])],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService], // 允许被引用
})
export class UserModule {}
