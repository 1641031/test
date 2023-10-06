import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';

// 防止脏信息 的方式，来过滤并修正信息。

@Injectable()
export class CreateUserPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    if (value.roles && value.roles instanceof Array && value.roles.length > 0) {
      // Roles[]
      if (value.roles[0]['id']) {
        value.roles = value.roles.map((role) => role.id);
      }
      // number[]
    }
    return value;
  }
}
