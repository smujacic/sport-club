import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository, getRepository } from 'typeorm'
import { SportClassEntity } from './entity/sportClass.entity'
import { LoggedInUserInterface } from 'src/auth/interface/loggedinUser.interface'
import { CreateSportClassDto } from './dto/createSportClass.dto'
import { RoleHelper } from 'src/helpers/role.helper'
import { UserRoleEnum } from 'src/auth/enum/userRoles.enum'
import { SportEntity } from 'src/sport/entity/sport.entity'
import { UpdateSportClassDto } from './dto/updateSportClass.dto'
import { PaginationHelper } from 'src/helpers/pagination.helper'
import { UserEntity } from 'src/user/entity/user.entity'

@Injectable()
export class SportClassService {
  constructor(
    @InjectRepository(SportEntity) private readonly sportRepository: Repository<SportEntity>,
    @InjectRepository(SportClassEntity) private readonly sportClassRepository: Repository<SportClassEntity>,
    @InjectRepository(UserEntity) private readonly userRepository: Repository<UserEntity>,
    private readonly roleHelper: RoleHelper,
    private readonly paginationHelper: PaginationHelper,
  ) {}

  /**
   *
   * @param user
   * @param classPayload
   * @returns
   */
  async createSportClass(user: LoggedInUserInterface, classPayload: CreateSportClassDto): Promise<void> {
    this.roleHelper.checkAdmin(user?.role as UserRoleEnum)

    try {
      const sportClass: SportClassEntity = this.sportClassRepository.create(classPayload)
      await this.sportClassRepository.save(sportClass)

      return
    } catch (error) {
      throw new InternalServerErrorException(error.message || error)
    }
  }

  /**
   *
   * @returns
   */
  async getSportClasses(id?: string | null, page = 1, size = 10): Promise<SportClassEntity | SportClassEntity[]> {
    try {
      if (id) {
        return await this.sportClassRepository.findOneBy({ id })
      }

      return await this.sportClassRepository.find(this.paginationHelper.pagination(page, size))
    } catch (error) {
      throw new InternalServerErrorException(error.message || error)
    }
  }

  /**
   *
   * @param user
   * @param id
   * @returns
   */
  async deleteSportClass(user: LoggedInUserInterface, id: string): Promise<void> {
    this.roleHelper.checkAdmin(user?.role as UserRoleEnum)

    try {
      const sportClass: SportClassEntity | SportClassEntity[] = await this.getSportClasses(id)

      if (!sportClass || Array.isArray(sportClass)) throw new NotFoundException()

      await this.sportClassRepository.remove(sportClass)

      return
    } catch (error) {
      throw new InternalServerErrorException(error.message || error)
    }
  }

  /**
   *
   * @param user
   * @param id
   * @param sportClassPayload
   * @returns
   */
  async updateSportClass(
    user: LoggedInUserInterface,
    id: string,
    sportClassPayload: UpdateSportClassDto,
  ): Promise<SportClassEntity> {
    this.roleHelper.checkAdmin(user?.role as UserRoleEnum)

    try {
      const sportClass: SportClassEntity | SportClassEntity[] = await this.getSportClasses(id)

      if (!sportClass || Array.isArray(sportClass)) throw new NotFoundException()

      sportClass.name = sportClassPayload?.name ? sportClassPayload?.name : sportClass.name
      sportClass.description = sportClassPayload?.description ? sportClassPayload?.description : sportClass.description

      const sportEntity = await this.sportRepository.findOneBy({ id: sportClass.sport?.id })

      sportClass.sport = sportEntity ? sportEntity : sportClass.sport

      return await this.sportClassRepository.save(sportClass)
    } catch (error) {
      throw new InternalServerErrorException(error.message || error)
    }
  }

  /**
   *
   * @param userId
   * @param sportClassId
   * @returns
   */
  async subscribeUserToSportClass(
    user: LoggedInUserInterface,
    userId: string,
    sportClassId: string,
  ): Promise<SportClassEntity> {
    this.roleHelper.checkAdmin(user?.role as UserRoleEnum)

    try {
      const user = await this.userRepository.findOneBy({ id: userId })
      const sportClass = await this.sportClassRepository.findOneBy({ id: sportClassId })

      if (!user || !sportClass) {
        throw new NotFoundException('User or sport class not found')
      }

      if (!sportClass.users) {
        sportClass.users = []
      }
      sportClass.users.push(user)

      return await this.sportClassRepository.save(sportClass)
    } catch (error) {
      throw new InternalServerErrorException(error.message || error)
    }
  }

  /**
   *
   * @param user
   * @param id
   * @returns
   */
  async getClassSubscriptions(user: LoggedInUserInterface, id: string): Promise<UserEntity[]> {
    this.roleHelper.checkAdmin(user?.role as UserRoleEnum)

    try {
      const sportClass = await this.sportClassRepository.findOneBy({ id })

      if (!sportClass) {
        return null
      }

      return sportClass.users
    } catch (error) {
      throw new InternalServerErrorException(error.message || error)
    }
  }
}
