import { Body, Controller, Post, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common'
import { UserService } from '../user/user.service'
import { ApiBadRequestResponse, ApiBearerAuth, ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger'
import { CreateUserDto } from '../user/dto/createUser.dto'
import { LoggedInUser } from './user.decorator'
import { JwtAuthGuard } from './jwt-aut.guards'
import { AuthCredentialsDto } from './dto/authCradentials.dto'
import { UserResponse } from './swagger/userResponse'
import { LoggedInUserInterface } from './interface/loggedinUser.interface'
import { UserEntity } from 'src/user/entity/user.entity'

@Controller('auth')
@UsePipes(new ValidationPipe({ transform: true }))
export class AuthController {
  constructor(private readonly usersService: UserService) {}

  @Post('/signeup')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Create new user',
    tags: ['Auth'],
  })
  @ApiBody({
    examples: {
      createUser: {
        value: {
          email: 'example@example.org',
          firstname: 'Jon',
          lastname: '',
          password: 'A0B1C2D!',
          address: '',
          oib: '',
          role: 'member',
        },
      },
    },
    type: CreateUserDto,
  })
  @ApiBadRequestResponse(UserResponse.badRequest)
  async signeUp(
    @LoggedInUser() user: LoggedInUserInterface,
    @Body() createUserPayload: CreateUserDto,
  ): Promise<UserEntity> {
    return await this.usersService.createUser(user, createUserPayload)
  }

  @Post('/signin')
  @ApiOperation({
    summary: 'Login',
    tags: ['Auth'],
  })
  @ApiBody({
    examples: {
      userLogin: {
        value: {
          email: 'example@example.org',
          password: 'A0B1C2D!',
        },
      },
    },
    type: AuthCredentialsDto,
  })
  @ApiResponse({
    schema: { type: 'object', properties: { accessToken: { type: 'string' } } },
  })
  async signIn(@Body() authCredentialsPayload: AuthCredentialsDto): Promise<{ accessToken: string }> {
    return await this.usersService.signIn(authCredentialsPayload)
  }
}
