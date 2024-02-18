import { Injectable, UnauthorizedException } from '@nestjs/common'
import { UserRoleEnum } from '../auth/enum/userRoles.enum'

@Injectable()
export class RoleHelper {
  /**
   *
   * @param role
   * @returns
   */
  checkAdmin(role: UserRoleEnum): boolean {
    if (![UserRoleEnum.ADMIN, UserRoleEnum.SUPERADMIN].includes(role)) throw new UnauthorizedException()

    return true
  }
}
