import { Module } from '@nestjs/common'
import { SportClassController } from './sport-class.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { SportClassEntity } from './entity/sportClass.entity'
import { SportClassService } from './sport-class.service'
import { JwtService } from '@nestjs/jwt'
import { RoleHelper } from '../helpers/role.helper'
import { SportEntity } from '../sport/entity/sport.entity'
import { PaginationHelper } from '../helpers/pagination.helper'
import { UserEntity } from '../user/entity/user.entity'

@Module({
  imports: [TypeOrmModule.forFeature([SportEntity, SportClassEntity, UserEntity])],
  controllers: [SportClassController],
  providers: [SportClassService, JwtService, RoleHelper, PaginationHelper],
})
export class SportClassModule {}
