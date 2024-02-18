import { Module } from '@nestjs/common'
import { UserController } from './user.controller'
import { UserService } from './user.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { UserEntity } from '../user/entity/user.entity'
import { UserRoleEntity } from '../user/entity/userRole.entity'
import { UserMetaEntity } from '../user/entity/userMeta.entity'
import { JwtService } from '@nestjs/jwt'
import { RoleHelper } from '../helpers/role.helper'
import { PaginationHelper } from 'src/helpers/pagination.helper'

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity, UserRoleEntity, UserMetaEntity])],
  providers: [UserService, JwtService, RoleHelper, PaginationHelper],
  exports: [UserService],
  controllers: [UserController],
})
export class UserModule {}
