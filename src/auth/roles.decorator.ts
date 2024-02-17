import { SetMetadata } from '@nestjs/common'
import { UserRoleEnum } from './enum/userRoles.enum'

export const Roles = (...roles: UserRoleEnum[]) => SetMetadata('roles', roles)
