import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  app.enableCors({
    origin: true, //['https://payment-gateway-project-frontend.vercel.app', 'http://localhost:3000'], // true
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    preflightContinue: false,
  });
  
  // Security headers using helmet
  app.use(helmet());

  // Global validation pipe for DTOs
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }));

  app.setGlobalPrefix('api/v1');

  // Swagger setup (in this case I prefer to use Postman, but I left the Swagger configuration here)
  const config = new DocumentBuilder()
    .setTitle('Test API')
    .setDescription('API for managing small e-commerce')
    .setVersion('1.0')
    .addTag('products')
    .addTag('transactions')
    .addTag('customers')
    .addTag('deliveries')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document, {
    swaggerOptions: {
      docExpansion: 'none',
      filter: true,
      showRequestDuration: true,
    },
  });

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
