import { Injectable, InternalServerErrorException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { SportEntity } from './entity/sport.entity'
import { Repository } from 'typeorm'
import { ImageEntity } from './entity/image.entity'
import { LoggedInUserInterface } from '../auth/interface/loggedinUser.interface'
import { CreateSportDto } from './dto/createSport.dto'
import { Multer } from 'multer'
import { RoleHelper } from '../helpers/role.helper'
import { UserRoleEnum } from '../auth/enum/userRoles.enum'
import { PaginationHelper } from '../helpers/pagination.helper'

@Injectable()
export class SportService {
  constructor(
    @InjectRepository(SportEntity) private readonly sportRepository: Repository<SportEntity>,
    @InjectRepository(ImageEntity) private readonly imageRepository: Repository<ImageEntity>,
    private readonly roleHelper: RoleHelper,
    private readonly paginationHelper: PaginationHelper,
  ) {}

  /**
   *
   * @param user
   * @param sportPayload
   * @param image
   */
  async createSport(user: LoggedInUserInterface, sportPayload: CreateSportDto, image: Multer.File): Promise<void> {
    this.roleHelper.checkAdmin(user?.role as UserRoleEnum)

    let savedImageData: ImageEntity = null
    if (image) {
      const imageData: ImageEntity = this.imageRepository.create({
        imageName: image?.originalname,
        mimetype: image?.mimetype,
        image: image?.buffer,
      })
      savedImageData = await this.imageRepository.save(imageData)
    }

    const { name, description } = sportPayload
    const sport = this.sportRepository.create({
      name,
      description,
      image: savedImageData ? savedImageData : null,
    })
    await this.sportRepository.save(sport)
  }

  /**
   *
   * @param search
   * @returns
   */
  async getSports(search?: string | null, page = 1, size = 10): Promise<SportEntity[]> {
    if (search) {
      const searchTerms = search.split(',').map((term) => term.trim())

      const query = this.sportRepository
        .createQueryBuilder('sport')
        .leftJoinAndSelect('sport.image', 'image')
        .where('sport.name ILIKE ANY(:searchTerms)', { searchTerms: searchTerms.map((term) => `%${term}%`) })

      return await query.getMany()
    }

    return await this.sportRepository.find(this.paginationHelper.pagination(page, size))
  }

  /**
   *
   * @param id
   * @returns
   */
  async getSport(id: string): Promise<SportEntity> {
    return await this.sportRepository.findOneBy({ id })
  }

  /**
   *
   * @param user
   * @param id
   * @returns
   */
  async deleteSport(user: LoggedInUserInterface, id: string): Promise<void> {
    this.roleHelper.checkAdmin(user?.role as UserRoleEnum)

    try {
      const image: ImageEntity = await this.imageRepository.findOneBy({ sport: { id } })
      await this.imageRepository.remove(image)

      const sport: SportEntity = await this.getSport(id)
      await this.sportRepository.remove(sport)

      return
    } catch (error) {
      throw new InternalServerErrorException(error.message || error)
    }
  }
}
