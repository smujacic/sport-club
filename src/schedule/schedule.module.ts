import { Module } from '@nestjs/common'
import { ScheduleController } from './schedule.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ScheduleEntity } from './entity/schedule.entity'
import { ScheduleService } from './schedule.service'
import { JwtService } from '@nestjs/jwt'
import { RoleHelper } from 'src/helpers/role.helper'
import { PaginationHelper } from 'src/helpers/pagination.helper'

@Module({
  imports: [TypeOrmModule.forFeature([ScheduleEntity])],
  providers: [ScheduleService, JwtService, RoleHelper, PaginationHelper],
  controllers: [ScheduleController],
})
export class ScheduleModule {}
