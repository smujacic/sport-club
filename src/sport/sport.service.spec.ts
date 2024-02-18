import { Test, TestingModule } from '@nestjs/testing'
import { SportService } from './sport.service'
import { getRepositoryToken } from '@nestjs/typeorm'
import { SportEntity } from './entity/sport.entity'
import { ImageEntity } from './entity/image.entity'
import { RoleHelper } from '../helpers/role.helper'
import { PaginationHelper } from '../helpers/pagination.helper'
import { Repository } from 'typeorm'
import { UserRoleEnum } from '../auth/enum/userRoles.enum'
import { UnauthorizedException } from '@nestjs/common'

const SPORT_REPOSITORY_TOKEN = getRepositoryToken(SportEntity)
const IMAGE_REPOSITORY_TOKEN = getRepositoryToken(ImageEntity)

const mockLoggedInUser = {
  id: 'some-string',
  email: 'test@email.com',
  role: UserRoleEnum.ADMIN,
}

const mockCreateSportDto = {
  name: 'Handball',
  description: 'Some sport description',
  image: null,
}
const mockImage = {
  originalname: 'test.jpg',
  mimetype: 'jpg',
  buffer: { data: [109, 111, 99, 107, 73, 109, 97, 103, 101, 68], type: 'Buffer' },
}

describe('Sport Service', () => {
  let sportService: SportService
  let sportRepository: Repository<SportEntity>
  let imageRepository: Repository<ImageEntity>

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SportService,
        RoleHelper,
        PaginationHelper,
        {
          provide: SPORT_REPOSITORY_TOKEN,
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
          },
        },
        {
          provide: IMAGE_REPOSITORY_TOKEN,
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
          },
        },
      ],
    }).compile()

    sportService = module.get<SportService>(SportService)
    sportRepository = module.get<Repository<SportEntity>>(SPORT_REPOSITORY_TOKEN)
    imageRepository = module.get<Repository<ImageEntity>>(IMAGE_REPOSITORY_TOKEN)
  })

  it('sport service should be define', () => {
    expect(sportService).toBeDefined()
  })

  it('sport repository should be define', () => {
    expect(sportRepository).toBeDefined()
  })

  it('image repository should be define', () => {
    expect(imageRepository).toBeDefined()
  })

  describe('createSport', () => {
    it('should throw unauthorized error', async () => {
      try {
        await sportService.createSport(null, mockCreateSportDto, null)
      } catch (error) {
        expect(error).toBeInstanceOf(UnauthorizedException)
      }
    })
    it('should create new sport without image', async () => {
      jest.spyOn(sportRepository, 'create').mockReturnValueOnce(new SportEntity())
      await sportService.createSport(mockLoggedInUser, mockCreateSportDto, null)

      expect(sportRepository.create).toHaveBeenCalledWith(mockCreateSportDto)
      expect(sportRepository.save).toHaveBeenCalledWith(new SportEntity())
    })

    it('should create new sport image', async () => {
      jest.spyOn(imageRepository, 'create').mockReturnValueOnce(new ImageEntity())
      await sportService.createSport(mockLoggedInUser, mockCreateSportDto, mockImage)
      expect(imageRepository.create).toHaveBeenCalledWith({
        imageName: mockImage.originalname,
        mimetype: mockImage.mimetype,
        image: mockImage.buffer,
      })
      expect(imageRepository.save).toHaveBeenCalledWith(new ImageEntity())
    })
  })
})
