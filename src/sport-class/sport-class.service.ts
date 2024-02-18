import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { SportClassEntity } from './entity/sportClass.entity'
import { LoggedInUserInterface } from '../auth/interface/loggedinUser.interface'
import { CreateSportClassDto } from './dto/createSportClass.dto'
import { RoleHelper } from '../helpers/role.helper'
import { UserRoleEnum } from '../auth/enum/userRoles.enum'
import { SportEntity } from '../sport/entity/sport.entity'
import { UpdateSportClassDto } from './dto/updateSportClass.dto'
import { PaginationHelper } from '../helpers/pagination.helper'
import { UserEntity } from '../user/entity/user.entity'

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
        const sportClass: SportClassEntity = await this.sportClassRepository.findOneBy({ id })
        if (!sportClass) throw new NotFoundException()

        return sportClass
      }

      const sportClasses: SportClassEntity[] = await this.sportClassRepository.find(
        this.paginationHelper.pagination(page, size),
      )
      if (sportClasses.length === 0) throw new NotFoundException()

      return sportClasses
    } catch (error) {
      if (error.status === 404) throw new NotFoundException()

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
      if (error.status === 404) throw new NotFoundException()

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
      if (error.status === 404) throw new NotFoundException()

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
      if (error.status === 404) throw new NotFoundException()

      throw new InternalServerErrorException(error.message || error)
    }
  }

  /**
   *
   * @param user
   * @param userId
   * @param sportClassId
   * @returns
   */
  async removeUserFromSportClass(
    user: LoggedInUserInterface,
    userId: string,
    sportClassId: string,
  ): Promise<SportClassEntity> {
    this.roleHelper.checkAdmin(user?.role as UserRoleEnum)
    console.log({ sportClassId })
    try {
      const sportClass = await this.sportClassRepository.findOneBy({ id: sportClassId })

      if (!sportClass) {
        throw new NotFoundException('User or sport class not found')
      }

      if (!sportClass.users) {
        sportClass.users = []
      } else {
        sportClass.users = sportClass.users.filter((user) => user.id !== userId)
      }

      return await this.sportClassRepository.save(sportClass)
    } catch (error) {
      if (error.status === 404) throw new NotFoundException()

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
