import { Injectable, UnauthorizedException } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { ConfigService } from '@nestjs/config'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { JwtPayload } from './interface/jwt-payload.interface'
import { UserEntity } from '../user/entity/user.entity'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(UserEntity) private readonly userRepository: Repository<UserEntity>,
    private readonly configService: ConfigService,
  ) {
    super({
      secretOrKeyProvider: (_request, _jwtToken, done) => {
        const secret = this.configService.get('JWT_SECRET')
        done(null, secret)
      },
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    })
  }

  async validate(payload: JwtPayload): Promise<UserEntity> {
    const { id } = payload

    const user = await this.userRepository.findOneBy({ id })

    if (!user) {
      throw new UnauthorizedException()
    }

    return user
  }
}
