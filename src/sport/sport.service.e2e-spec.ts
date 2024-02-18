import { Test, TestingModule } from '@nestjs/testing'
import { HttpStatus, INestApplication } from '@nestjs/common'
import * as request from 'supertest'
import { AppModule } from '../app.module'

describe('SportController (e2e)', () => {
  let app: INestApplication
  let accessToken: string

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile()

    app = moduleFixture.createNestApplication()
    await app.init()

    const response = await request(app.getHttpServer())
      .post('/auth/signin')
      .send({ email: 'super@example.com', password: 'Admin2023' })
    accessToken = response.body.accessToken
  })

  afterAll(async () => {
    await app.close()
  })

  it('should create a new sport with image', async () => {
    const mockCreateSportDto = {
      name: 'Handball' + Math.floor(Math.random() * 3),
      description: 'Some sport description',
    }

    const mockImage = {
      imageName: 'test.jpg',
      mimetype: 'jpg',
      buffer: Buffer.from([109, 111, 99, 107, 73, 109, 97, 103, 101, 68]),
    }

    const response = await request(app.getHttpServer())
      .post('/sport')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ ...mockCreateSportDto, image: mockImage })
    expect(response.status).toBe(HttpStatus.CREATED)
  })
})
