import { Body, Controller, Delete, Get, Param, Patch, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common'
import { UserService } from './user.service'
import { JwtAuthGuard } from '../auth/jwt-aut.guards'
import { ApiBadRequestResponse, ApiBearerAuth, ApiBody, ApiOperation } from '@nestjs/swagger'
import { AuthCredentialsDto } from '../auth/dto/authCradentials.dto'
import { LoggedInUser } from '../auth/user.decorator'
import { LoggedInUserInterface } from '../auth/interface/loggedinUser.interface'
import { UserResponse } from '../auth/swagger/userResponse'
import { UpdateUserDto } from './dto/updateUser.dto'
import { UserEntity } from './entity/user.entity'

@Controller('user')
@UsePipes(new ValidationPipe({ transform: true }))
export class UserController {
  constructor(private readonly usersService: UserService) {}

  @Get('/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Get user data',
    tags: ['Users'],
  })
  async getUser(@LoggedInUser() user: LoggedInUserInterface, @Param('id') id: string): Promise<UserEntity> {
    return await this.usersService.getUser(user, id)
  }

  @Get('')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Get users data',
    tags: ['Users'],
  })
  async getUsers(@LoggedInUser() user: LoggedInUserInterface): Promise<UserEntity[]> {
    return await this.usersService.getUsers(user)
  }

  @Patch('/:id/user-status')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'User status update',
    tags: ['Users'],
  })
  @ApiBody({
    examples: {
      updateUserStatus: {
        value: {
          status: false,
        },
      },
    },
    type: AuthCredentialsDto,
  })
  async changeUserStatus(
    @LoggedInUser() user: LoggedInUserInterface,
    @Param('id') id: string,
    @Body() payload: { status: boolean },
  ): Promise<void> {
    const { status } = payload
    return this.usersService.changeUserStatus(user, id, status)
  }

  @Delete('/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Delete user',
    tags: ['Users'],
  })
  async deleteUser(@LoggedInUser() user: LoggedInUserInterface, @Param('id') id: string) {
    return this.usersService.deleteUser(user, id)
  }

  @Patch('/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Update user',
    tags: ['Users'],
  })
  @ApiBody({
    examples: {
      updateUser: {
        value: {
          firstname: 'Jon',
          lastname: '',
          password: 'A0B1C2D!',
          address: '',
          oib: '',
          role: 'member',
        },
      },
    },
    type: UpdateUserDto,
  })
  @ApiBadRequestResponse(UserResponse.badRequest)
  async updateUser(
    @LoggedInUser() user: LoggedInUserInterface,
    @Param('id') id: string,
    @Body() createUserPayload: UpdateUserDto,
  ) {
    return this.usersService.updateUser(user, id, createUserPayload)
  }
}
