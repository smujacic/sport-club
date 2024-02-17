import { Module } from '@nestjs/common'
import { UserController } from './user.controller'
import { UserService } from './user.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { UserEntity } from 'src/user/entity/user.entity'
import { UserRoleEntity } from 'src/user/entity/userRole.entity'
import { UserMetaEntity } from 'src/user/entity/userMeta.entity'
import { JwtService } from '@nestjs/jwt'

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity, UserRoleEntity, UserMetaEntity])],
  providers: [UserService, JwtService],
  exports: [UserService],
  controllers: [UserController],
})
export class UserModule {}
