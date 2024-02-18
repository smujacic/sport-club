import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common'
import { SportClassService } from './sport-class.service'
import { CreateSportClassDto } from './dto/createSportClass.dto'
import { LoggedInUserInterface } from '../auth/interface/loggedinUser.interface'
import { LoggedInUser } from '../auth/user.decorator'
import { ApiBearerAuth, ApiBody, ApiOperation } from '@nestjs/swagger'
import { JwtAuthGuard } from '../auth/jwt-aut.guards'
import { SportClassEntity } from './entity/sportClass.entity'
import { UpdateSportClassDto } from './dto/updateSportClass.dto'
import { UserEntity } from '../user/entity/user.entity'

@Controller('sport-class')
@UsePipes(new ValidationPipe({ transform: true }))
export class SportClassController {
  constructor(private readonly sportClassService: SportClassService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Create new sport class',
    tags: ['Sport class'],
  })
  @ApiBody({
    examples: {
      createSportClass: {
        value: {
          name: 'Handball junior',
          description: 'Handball sport class for kids 6-10',
          sport: {
            id: '',
            name: 'Handball',
            description: '',
          },
        },
      },
    },
    type: CreateSportClassDto,
  })
  async createSportClass(
    @LoggedInUser() user: LoggedInUserInterface,
    @Body() classPayload: CreateSportClassDto,
  ): Promise<void> {
    return await this.sportClassService.createSportClass(user, classPayload)
  }

  @Get()
  @ApiOperation({
    summary: 'Get all sport classes',
    tags: ['Sport class'],
  })
  async getSportClasses(): Promise<SportClassEntity[]> {
    const sportClass = await this.sportClassService.getSportClasses()

    if (!Array.isArray(sportClass)) {
      throw new NotFoundException('Sport classes not found')
    }

    return sportClass
  }

  @Get('/:id')
  @ApiOperation({
    summary: 'Get sport class',
    tags: ['Sport class'],
  })
  async getSportClass(@Param('id') id: string): Promise<SportClassEntity> {
    const sportClass: SportClassEntity | SportClassEntity[] = await this.sportClassService.getSportClasses(id)

    if (Array.isArray(sportClass)) {
      throw new NotFoundException('Sport class not found')
    }

    return sportClass
  }

  @Delete('/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Delete sport class',
    tags: ['Sport class'],
  })
  async deleteSportClass(@LoggedInUser() user: LoggedInUserInterface, @Param('id') id: string): Promise<void> {
    return await this.sportClassService.deleteSportClass(user, id)
  }

  @Patch('/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Update sport class',
    tags: ['Sport class'],
  })
  async updateSportClass(
    @LoggedInUser() user: LoggedInUserInterface,
    @Param('id') id: string,
    @Body() sportClassPayload: UpdateSportClassDto,
  ): Promise<SportClassEntity> {
    return await this.sportClassService.updateSportClass(user, id, sportClassPayload)
  }

  @Post('/subscribe-user-sport-class')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Enroll user in sport class',
    tags: ['Sport class'],
  })
  @ApiBody({
    examples: {
      subscribeUser: {
        value: {
          userId: '',
          sportClassId: '',
        },
      },
    },
    type: 'object',
  })
  async subscribeUserToSportClass(
    @LoggedInUser() user: LoggedInUserInterface,
    @Body() payload: { userId: string; sportClassId: string },
  ): Promise<SportClassEntity> {
    const { userId, sportClassId } = payload

    return await this.sportClassService.subscribeUserToSportClass(user, userId, sportClassId)
  }

  @Get('/sport-class-subscribers/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Sport class users',
    tags: ['Sport class'],
  })
  async getClassSubscriptions(
    @LoggedInUser() user: LoggedInUserInterface,
    @Param('id') id: string,
  ): Promise<UserEntity[]> {
    return await this.sportClassService.getClassSubscriptions(user, id)
  }
}
