import { ApiProperty } from '@nestjs/swagger'
import { IsString, MaxLength, MinLength } from 'class-validator'

export class CreateSportDto {
  @ApiProperty({
    description: 'Sport name',
    minLength: 3,
    maxLength: 20,
    required: true,
  })
  @IsString()
  @MinLength(3)
  @MaxLength(20)
  name: string

  @ApiProperty({
    description: 'Sport desscription',
    minLength: 3,
    required: true,
  })
  @IsString()
  @MinLength(3)
  description: string
}
