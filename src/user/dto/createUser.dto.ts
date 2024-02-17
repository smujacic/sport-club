import { IsEnum, IsOptional, IsString, Matches, MaxLength, MinLength } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'
import { UserRoleEnum } from '../../auth/enum/userRoles.enum'

export class CreateUserDto {
  @ApiProperty({
    description: 'This must be valide email address',
    required: true,
    example: 'example@example.org',
  })
  @IsString()
  @Matches(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, {
    message: 'This is not valid email address',
  })
  email: string

  @ApiProperty({
    description: 'Password needs to have at least one small letter, one big letter and one number',
    minLength: 8,
    maxLength: 32,
    required: true,
  })
  @IsString()
  @MinLength(8)
  @MaxLength(32)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'password needs to have at least one small letter, one big letter and one number',
  })
  password: string

  @ApiProperty({
    description: `Available user roles ${Object.values(UserRoleEnum)}`,
    required: true,
  })
  @IsEnum(UserRoleEnum)
  @IsOptional()
  role?: UserRoleEnum

  @ApiProperty({
    description: 'User firstname',
    minLength: 3,
    maxLength: 20,
    required: true,
  })
  @IsString()
  @MinLength(3)
  @MaxLength(20)
  firstname: string

  @ApiProperty({
    description: 'User lastname',
    minLength: 3,
    maxLength: 30,
    required: true,
  })
  @IsString()
  @MinLength(3)
  @MaxLength(30)
  lastname: string

  @ApiProperty({
    description: `User address`,
    required: false,
  })
  @IsString()
  @IsOptional()
  address?: string

  @ApiProperty({
    description: `User OIB`,
    required: false,
  })
  @IsString()
  @IsOptional()
  oib?: string
}
