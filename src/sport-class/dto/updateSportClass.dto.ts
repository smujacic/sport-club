import { ApiProperty } from '@nestjs/swagger'
import { IsOptional, IsString } from 'class-validator'
import { CreateSportDto } from '../../sport/dto/createSport.dto'

export class UpdateSportClassDto {
  @ApiProperty({
    description: 'Sport class name',
    required: false,
  })
  @IsString()
  @IsOptional()
  name?: string

  @ApiProperty({
    description: 'Sport class description',
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string

  @ApiProperty({ type: CreateSportDto, description: 'Sport information', required: false })
  @IsOptional()
  sport?: CreateSportDto

  @ApiProperty({ type: 'string', description: 'Schedule ID', required: false })
  @IsOptional()
  scheduleId?: string
}
