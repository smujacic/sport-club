import { createParamDecorator, ExecutionContext } from '@nestjs/common'
import { UserEntity } from '../user/entity/user.entity'

export const LoggedInUser = createParamDecorator((_data: unknown, context: ExecutionContext): UserEntity => {
  const request = context.switchToHttp().getRequest()

  return request.user
})
