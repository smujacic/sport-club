import { ApiProperty } from '@nestjs/swagger'
import { IsString } from 'class-validator'
import { CreateSportDto } from '../../sport/dto/createSport.dto'

export class CreateSportClassDto {
  @ApiProperty({
    description: 'Sport class name',
    required: true,
  })
  @IsString()
  name: string

  @ApiProperty({
    description: 'Sport class description',
    required: true,
  })
  @IsString()
  description: string

  @ApiProperty({ type: CreateSportDto, description: 'Sport information' })
  sport: CreateSportDto

  @ApiProperty({ type: 'string', description: 'Schedule ID', required: false })
  scheduleId: string
}
