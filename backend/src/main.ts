import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // CORS
  app.enableCors({ origin: 'https://www.centre.com.pk' });
  
  // Global prefix
  app.setGlobalPrefix('api');
  
  // Validation Pipe
  app.useGlobalPipes(new ValidationPipe({ 
    whitelist: true, 
    transform: true,
    forbidNonWhitelisted: false,
  }));
  
  // Swagger Documentation
  const config = new DocumentBuilder()
    .setTitle('Centre.com.pk API')
    .setDescription('Free Online Tools API Documentation')
    .setVersion('1.0')
    .addBearerAuth()
    .addServer('https://www.centre.com.pk/api')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);
  
  await app.listen(3001);
  console.log('🚀 Backend running on http://localhost:3001');
  console.log('📚 Swagger docs on http://localhost:3001/api/docs');
}
bootstrap();