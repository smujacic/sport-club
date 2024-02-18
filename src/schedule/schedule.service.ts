import { InjectRepository } from '@nestjs/typeorm'
import { ScheduleEntity } from './entity/schedule.entity'
import { Repository } from 'typeorm'
import { Injectable, InternalServerErrorException } from '@nestjs/common'
import { CreateScheduleDto } from './dto/createSchedule.dto'
import { LoggedInUserInterface } from 'src/auth/interface/loggedinUser.interface'
import { RoleHelper } from 'src/helpers/role.helper'
import { UserRoleEnum } from 'src/auth/enum/userRoles.enum'
import { PaginationHelper } from 'src/helpers/pagination.helper'

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
}
