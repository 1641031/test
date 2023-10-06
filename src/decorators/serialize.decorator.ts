import { SerializeInterceptor } from '@/interceptors/serialize/serialize.interceptor';
import { UseInterceptors } from '@nestjs/common';

interface ClassConstructor {
  new (...args: any[]): any;
}

export function Serialize(dto: ClassConstructor) {
  return UseInterceptors(new SerializeInterceptor(dto));
}
