import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as configs from 'config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('Assignment Api')
    .setDescription('The Assignment API Service')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  app.use('/docs/swagger.json', (req, res) => {
    res.send(document);
  });
  SwaggerModule.setup('/docs', app, document, {
    swaggerUrl: 'http://localhost:4000/docs/swagger.json',
    explorer: true,
    swaggerOptions: {
      docExpansion: 'list',
      filter: true,
      showRequestDuration: true,
      persistAuthorization: true,
      defaultModelsExpandDepth: -1
    }
  });

  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);

  await app.listen(configs.get('port') ?? 3000);
}

bootstrap();
