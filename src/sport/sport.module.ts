import { Module } from '@nestjs/common'
import { SportController } from './sport.controller'
import { SportService } from './sport.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { SportEntity } from './entity/sport.entity'
import { ImageEntity } from './entity/image.entity'
import { RoleHelper } from '../helpers/role.helper'
import { JwtService } from '@nestjs/jwt'
import { PaginationHelper } from '../helpers/pagination.helper'

@Module({
  imports: [TypeOrmModule.forFeature([SportEntity, ImageEntity])],
  controllers: [SportController],
  providers: [SportService, RoleHelper, JwtService, PaginationHelper],
})
export class SportModule {}
