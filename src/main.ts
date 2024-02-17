import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { ConfigService } from '@nestjs/config'
import { ValidationPipe } from '@nestjs/common'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  app.enableCors()

  const configService = app.get(ConfigService)

  const swaggerConfig = new DocumentBuilder()
    .setTitle(configService.get('SWAGGER_TITLE'))
    .setDescription(configService.get('SWAGGER_DESCRIPTION'))
    .setVersion(configService.get('SWAGGER_VERSION'))
    .addBearerAuth()
    .build()

  const swaggerDocument = SwaggerModule.createDocument(app, swaggerConfig)
  SwaggerModule.setup('api/docs', app, swaggerDocument)

  app.useGlobalPipes(new ValidationPipe())

  await app.listen(configService.get('PORT'))
}
bootstrap()
