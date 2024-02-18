import { MiddlewareConsumer, Module, NestModule, OnApplicationBootstrap } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { configurationValidationSchema } from './configuration/config.schema'
import { AuthModule } from './auth/auth.module'
import { TypeOrmModule } from '@nestjs/typeorm'
import { DatabaseConfig } from './configuration'
import { UserService } from './user/user.service'
import { UserController } from './user/user.controller'
import { UserModule } from './user/user.module'
import { SportModule } from './sport/sport.module'
import { SportClassModule } from './sport-class/sport-class.module'
import { ScheduleModule } from './schedule/schedule.module'

@Module({
  imports: [
    ConfigModule.forRoot({
      validationSchema: configurationValidationSchema,
      isGlobal: true,
      load: [DatabaseConfig],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        ...configService.get('postgres-db'),
      }),
    }),
    AuthModule,
    UserModule,
    SportModule,
    SportClassModule,
    ScheduleModule,
  ],
  controllers: [UserController],
  providers: [],
})
export class AppModule implements OnApplicationBootstrap, NestModule {
  constructor(private readonly usersService: UserService) {}

  async onApplicationBootstrap(): Promise<void> {
    await this.usersService.createRole()
    await this.usersService.createSuperAdmin()
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  configure(_consumer: MiddlewareConsumer) {}
}
