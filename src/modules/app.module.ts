import { MiddlewareConsumer, Module } from '@nestjs/common';
import { CoreModule } from './core/core.module';
import { APP_FILTER } from '@nestjs/core';
import { AllExceptionsFilter } from 'src/global-http-ex.filter';
import { RateLimitMiddleware } from './core/middlewares/rate-limit.middleware';

@Module({
  imports: [CoreModule],
  providers: [
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RateLimitMiddleware).forRoutes('auth', 'user', 'role');
  }
}
