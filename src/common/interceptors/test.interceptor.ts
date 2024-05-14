import { NestInterceptor, ExecutionContext, CallHandler, mixin } from '@nestjs/common'
import { Observable } from 'rxjs'

export function TestInterceptor() {
  class MixinInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
      const { file } = context.switchToHttp().getRequest()
      console.log(file)
      return next.handle()
    }
  }

  const Interceptor = mixin(MixinInterceptor)
  return Interceptor
}
