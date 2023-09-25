import {
  Injectable,
  Logger,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private logger = new Logger('UserModule');

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const method = request.method;
    const url = request.url;
    const requestBody = JSON.stringify(request.body);

    // Log the request
    this.logger.log(
      `[${method}] ${url} - Request Body: ${requestBody}`,
      'Request',
    );

    return next.handle().pipe(
      tap((response) => {
        const responseStatus = context.switchToHttp().getResponse().statusCode;
        const responseBody = JSON.stringify(response);

        // Log the response
        this.logger.log(
          `[${method}] ${url} - Response Status: ${responseStatus} - Response Body: ${responseBody}`,
          'Response',
        );
      }),
    );
  }
}
