import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
  Query,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common'
import { ScheduleService } from './schedule.service'
import { JwtAuthGuard } from '../auth/jwt-aut.guards'
import { ApiBearerAuth, ApiBody, ApiOperation, ApiQuery } from '@nestjs/swagger'
import { LoggedInUserInterface } from 'src/auth/interface/loggedinUser.interface'
import { LoggedInUser } from '../auth/user.decorator'
import { CreateScheduleDto } from './dto/createSchedule.dto'
import { ScheduleEntity } from './entity/schedule.entity'

@Controller('schedule')
@UsePipes(new ValidationPipe({ transform: true }))
export class ScheduleController {
  constructor(private readonly scheduleService: ScheduleService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Create new schedule',
    tags: ['Schedule'],
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string' },
        description: { type: 'string' },
        image: { type: 'string', format: 'binary' },
      },
      required: ['name', 'description'],
    },
    type: CreateScheduleDto,
  })
  async createSport(
    @LoggedInUser() user: LoggedInUserInterface,
    @Body() schedulePayload: CreateScheduleDto,
  ): Promise<void> {
    return await this.scheduleService.createSchedule(user, schedulePayload)
  }

  @Get()
  @ApiOperation({
    summary: 'Get all schedules',
    tags: ['Schedule'],
  })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'size', required: false, type: Number })
  async getSchedules(@Query('page') page?: number, @Query('size') size?: number): Promise<ScheduleEntity[]> {
    const schedules: ScheduleEntity | ScheduleEntity[] = await this.scheduleService.getSchedule(
      null,
      page ? page : 1,
      size ? size : 10,
    )

    if (!Array.isArray(schedules)) {
      throw new NotFoundException('Schedules not found')
    }

    return schedules
  }

  @Get('/:id')
  @ApiOperation({
    summary: 'Get schedule',
    tags: ['Schedule'],
  })
  async getSchedule(@Param('id') id: string): Promise<ScheduleEntity> {
    const schedule: ScheduleEntity | ScheduleEntity[] = await this.scheduleService.getSchedule(id)

    if (Array.isArray(schedule)) {
      throw new NotFoundException('Schedule not found')
    }

    return schedule
  }
}
