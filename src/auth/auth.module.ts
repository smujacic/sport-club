import { Module } from '@nestjs/common'
import { UserEntity } from '../user/entity/user.entity'
import { TypeOrmModule } from '@nestjs/typeorm'
import { UserService } from '../user/user.service'
import { UserRoleEntity } from '../user/entity/userRole.entity'
import { UserMetaEntity } from '../user/entity/userMeta.entity'
import { AuthController } from './auth.controller'
import { JwtService } from '@nestjs/jwt'
import { RoleHelper } from '../helpers/role.helper'
import { PaginationHelper } from 'src/helpers/pagination.helper'

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity, UserRoleEntity, UserMetaEntity])],
  providers: [UserService, JwtService, RoleHelper, PaginationHelper],
  exports: [JwtService],
  controllers: [AuthController],
})
export class AuthModule {}
