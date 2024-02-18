import { Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException } from '@nestjs/common'
import { UserRoleEntity } from './entity/userRole.entity'
import { InjectRepository } from '@nestjs/typeorm'
import { UserEntity } from './entity/user.entity'
import { UserRoleEnum } from '../auth/enum/userRoles.enum'
import { Repository } from 'typeorm'
import { ConfigService } from '@nestjs/config'
import { CreateUserDto } from './dto/createUser.dto'
import * as bcrypt from 'bcrypt'
import { UserMetaEntity } from './entity/userMeta.entity'
import { AuthCredentialsDto } from '../auth/dto/authCradentials.dto'
import { JwtService } from '@nestjs/jwt'
import { LoggedInUserInterface } from '../auth/interface/loggedinUser.interface'
import { UpdateUserDto } from './dto/updateUser.dto'
import { RoleHelper } from '../helpers/role.helper'
import { PaginationHelper } from 'src/helpers/pagination.helper'

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserRoleEntity)
    private readonly userRoleRepository: Repository<UserRoleEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(UserMetaEntity) private readonly userMetaRepository: Repository<UserMetaEntity>,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
    private readonly roleHelper: RoleHelper,
    private readonly paginationHelper: PaginationHelper,
  ) {}

  /**
   * Create users roles
   */
  async createRole(): Promise<void> {
    const userRoles = Object.values(UserRoleEnum)

    for (const role of userRoles) {
      const existingRole: UserRoleEntity = await this.userRoleRepository.findOneBy({
        name: role,
      })

      if (!existingRole) {
        try {
          const newRole: UserRoleEntity = this.userRoleRepository.create({ name: role })
          await this.userRoleRepository.save(newRole)
        } catch (error) {
          throw new InternalServerErrorException(error.message || error)
        }
      }
    }
  }

  /**
   * Create superadmin
   */
  async createSuperAdmin(): Promise<void> {
    try {
      const existingSuperAdmin: UserEntity = await this.userRepository.findOneBy({
        email: this.configService.get('SUPERADMIN_EMAIL'),
      })

      if (!existingSuperAdmin) {
        this.createUser(
          {
            role: UserRoleEnum.SUPERADMIN,
            email: this.configService.get('SUPERADMIN_EMAIL'),
            id: null,
          },
          {
            role: UserRoleEnum.SUPERADMIN,
            email: this.configService.get('SUPERADMIN_EMAIL'),
            firstname: this.configService.get('SUPERADMIN_FIRSTNAME'),
            lastname: this.configService.get('SUPERADMIN_LASTNAME'),
            password: this.configService.get('SUPERADMIN_PASSWORD'),
          },
        )
      }
    } catch (error) {
      throw new InternalServerErrorException(error.message || error)
    }
  }

  /**
   * Create user method. If user is not ADMIN or SUPERADMIN the method wil throw UnauthorizedException
   *
   * @param user
   * @param createUserPayload
   */
  async createUser(user: LoggedInUserInterface, createUserPayload: CreateUserDto): Promise<void> {
    this.roleHelper.checkAdmin(user.role as UserRoleEnum)

    try {
      const { email, firstname, role, lastname, password, address, oib } = createUserPayload

      const getRole: UserRoleEntity = await this.userRoleRepository.findOneBy({
        name: role ? role : UserRoleEnum.MEMBER,
      })

      const salt = await bcrypt.genSalt()
      const hashedPassword = await bcrypt.hash(password, salt)

      const userMeta = this.userMetaRepository.create({
        firstname,
        lastname,
        address,
        oib,
      })

      const savedUserMeta = await this.userMetaRepository.save(userMeta)

      const userEntity = this.userRepository.create({
        email,
        password: hashedPassword,
        role: getRole,
        isActive: true,
        meta: savedUserMeta,
      })

      await this.userRepository.save(userEntity)
    } catch (error) {
      throw new InternalServerErrorException(error.message || error)
    }
  }

  /**
   *
   * @param authCredentialsPayload
   * @returns
   */
  async signIn(authCredentialsPayload: AuthCredentialsDto): Promise<{ accessToken: string }> {
    const { email, password } = authCredentialsPayload

    try {
      const user: UserEntity = await this.userRepository.findOneBy({
        email,
        isActive: true,
      })

      if (user && (await bcrypt.compare(password, user.password))) {
        const payload = { email, role: user.roleName, id: user.id }
        const accessToken: string = this.jwtService.sign(payload, {
          expiresIn: this.configService.get('JWT_TOKEN_EXPIRES'),
          secret: this.configService.get('JWT_SECRET'),
        })

        return { accessToken }
      } else {
        throw new UnauthorizedException()
      }
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
  async getUser(user: LoggedInUserInterface, id: string): Promise<UserEntity> {
    if (user.id !== id) this.roleHelper.checkAdmin(user.role as UserRoleEnum)

    try {
      const userData: UserEntity = await this.userRepository.findOneBy({ id })

      if (!userData) throw new NotFoundException()

      return userData
    } catch (error) {
      throw new InternalServerErrorException(error.message || error)
    }
  }

  /**
   *
   * @param user
   * @returns
   */
  async getUsers(user: LoggedInUserInterface, page = 1, size = 10): Promise<UserEntity[]> {
    this.roleHelper.checkAdmin(user.role as UserRoleEnum)

    try {
      const usersData: UserEntity[] = await this.userRepository.find(this.paginationHelper.pagination(page, size))

      if (!usersData) throw new NotFoundException()

      return usersData
    } catch (error) {
      throw new InternalServerErrorException(error.message || error)
    }
  }

  /**
   *
   * @param author
   * @param id
   * @param status
   * @returns
   */
  async changeUserStatus(user: LoggedInUserInterface, id: string, status: boolean): Promise<void> {
    try {
      const userData: UserEntity = await this.getUser(user, id)

      userData.isActive = status
      await this.userRepository.save(userData)

      return
    } catch (error) {
      throw new InternalServerErrorException(error.message || error)
    }
  }

  /**
   *
   * @param user
   * @param id
   * @param updateUserPayload
   * @returns
   */
  async updateUser(user: LoggedInUserInterface, id: string, updateUserPayload: UpdateUserDto): Promise<UserEntity> {
    try {
      const userData = await this.getUser(user, id)

      const { firstname, role, lastname, password, address, oib } = updateUserPayload

      let hashedPassword = userData.password
      if (password) {
        const salt = await bcrypt.genSalt()
        hashedPassword = await bcrypt.hash(password, salt)
        userData.password = hashedPassword
      }

      const roleName = role ? UserRoleEnum[role] : UserRoleEnum[userData.roleName]
      const getRole: UserRoleEntity = await this.userRoleRepository.findOneBy({ name: roleName })
      userData.role = getRole

      const userMeta = await this.userMetaRepository.findOneBy({ user: { id } })
      if (userMeta) {
        userMeta.firstname = firstname ?? userData.meta.firstname
        userMeta.lastname = lastname ?? userData.meta.lastname
        userMeta.address = address ?? userData.meta.address
        userMeta.oib = oib ?? userData.meta.oib

        await this.userMetaRepository.save(userMeta)
      }
      await this.userRepository.save(userData)

      return await this.getUser(user, id)
    } catch (error) {
      throw new InternalServerErrorException(error.message || error)
    }
  }

  /**
   *
   * @param author
   * @param id
   * @returns
   */
  async deleteUser(user: LoggedInUserInterface, id: string): Promise<void> {
    try {
      const userMeta: UserMetaEntity = await this.userMetaRepository.findOneBy({ user: { id: id } })
      await this.userMetaRepository.remove(userMeta)

      const userData: UserEntity = await this.getUser(user, id)
      await this.userRepository.remove(userData)

      return
    } catch (error) {
      throw new InternalServerErrorException(error.message || error)
    }
  }
}
