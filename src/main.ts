import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './modules/app.module';
import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';
import { LoggingInterceptor } from './shared/interceptors/logging.interceptor';

const corsOptions: CorsOptions = {
  origin: 'http://localhost:3000', //om-7_app
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Add the allowed HTTP methods
  allowedHeaders: ['Content-Type', 'Authorization'], // Add the allowed request headers
};

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // const port = process.env.PORT || 3000;

  app.useGlobalInterceptors(new LoggingInterceptor());
  app.enableCors(corsOptions); // Cors issue
  const options = new DocumentBuilder()
    .setTitle('User management')
    .setDescription('CRUD Users')
    .setVersion('1.0')
    .addTag('users')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api', app, document, {
    swaggerOptions: {
      tagsSorter: 'alpha',
      operationsSorter: 'alpha',
    },
  });

  await app.listen(4000);
}
bootstrap();
