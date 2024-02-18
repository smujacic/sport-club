import { InjectRepository } from '@nestjs/typeorm'
import { ScheduleEntity } from './entity/schedule.entity'
import { Repository } from 'typeorm'
import { BadGatewayException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common'
import { CreateScheduleDto } from './dto/createSchedule.dto'
import { LoggedInUserInterface } from '../auth/interface/loggedinUser.interface'
import { RoleHelper } from '../helpers/role.helper'
import { UserRoleEnum } from '../auth/enum/userRoles.enum'
import { PaginationHelper } from '../helpers/pagination.helper'
import { DayOfWeek } from './enum/dayOfWeek.enum'
import { UpdateScheduleDto } from './dto/updateSchadule.dto'

@Injectable()
export class ScheduleService {
  constructor(
    @InjectRepository(ScheduleEntity) private readonly scheduleRepository: Repository<ScheduleEntity>,
    private readonly roleHelper: RoleHelper,
    private readonly paginationHelper: PaginationHelper,
  ) {}

  /**
   *
   * @param user
   * @param schedulePayload
   * @returns
   */
  async createSchedule(user: LoggedInUserInterface, schedulePayload: CreateScheduleDto): Promise<void> {
    this.roleHelper.checkAdmin(user.role as UserRoleEnum)

    try {
      const dayOfWeekUpperCase = schedulePayload.dayOfWeek.toUpperCase()
      if (!(dayOfWeekUpperCase in DayOfWeek)) {
        throw new BadGatewayException('Invalid day of the week')
      }

      schedulePayload.dayOfWeek = dayOfWeekUpperCase as DayOfWeek
      const schedule: ScheduleEntity = this.scheduleRepository.create(schedulePayload)
      await this.scheduleRepository.save(schedule)

      return
    } catch (error) {
      throw new InternalServerErrorException(error.message || error)
    }
  }

  /**
   *
   * @param id
   * @returns
   */
  async getSchedule(id?: string | null, page = 1, size = 10): Promise<ScheduleEntity | ScheduleEntity[]> {
    try {
      if (id) {
        return await this.scheduleRepository.findOneBy({ id })
      }

      return await this.scheduleRepository.find(this.paginationHelper.pagination(page, size))
    } catch (error) {
      throw new InternalServerErrorException(error.message || error)
    }
  }

  /**
   *
   * @param user
   * @param id
   * @param schedulePayload
   * @returns
   */
  async updateSchedule(
    user: LoggedInUserInterface,
    id: string,
    schedulePayload: UpdateScheduleDto,
  ): Promise<ScheduleEntity> {
    this.roleHelper.checkAdmin(user.role as UserRoleEnum)

    try {
      const schadule = await this.scheduleRepository.findOneBy({ id })

      if (!schadule) throw new NotFoundException()

      if (schedulePayload.dayOfWeek) {
        const dayOfWeekUpperCase = schedulePayload.dayOfWeek.toUpperCase()
        if (!(dayOfWeekUpperCase in DayOfWeek)) {
          throw new BadGatewayException('Invalid day of the week')
        }

        schadule.dayOfWeek = dayOfWeekUpperCase as DayOfWeek
      }

      schadule.duration = schedulePayload.duration ?? schadule.duration
      schadule.time = schedulePayload.time ?? schadule.time
      schadule.sportClass = schedulePayload.sportClass ?? schadule.sportClass

      return await this.scheduleRepository.save(schadule)
    } catch (error) {
      if (error.status === 404) throw new NotFoundException()

      throw new InternalServerErrorException(error.message || error)
    }
  }

  /**
   *
   * @param user
   * @param id
   */
  async deleteSchedule(user: LoggedInUserInterface, id: string): Promise<void> {
    this.roleHelper.checkAdmin(user.role as UserRoleEnum)

    try {
      const schadule = await this.scheduleRepository.findOneBy({ id })

      if (!schadule) throw new NotFoundException()

      await this.scheduleRepository.remove(schadule)
    } catch (error) {
      if (error.status === 404) throw new NotFoundException()

      throw new InternalServerErrorException(error.message || error)
    }
  }
}
