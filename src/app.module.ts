import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { configurationValidationSchema } from './configuration/config.schema'

@Module({
  imports: [
    ConfigModule.forRoot({
      validationSchema: configurationValidationSchema,
      isGlobal: true,
      load: [],
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
