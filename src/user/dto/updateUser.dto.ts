import { IsDate, IsEnum, IsOptional, IsString, IsUUID, Matches, MaxLength, MinLength } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'
import { UserRoleEnum } from '../../auth/enum/userRoles.enum'

export class UpdateUserDto {
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
  @IsOptional()
  password?: string

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
  @IsOptional()
  firstname?: string

  @ApiProperty({
    description: 'User lastname',
    minLength: 3,
    maxLength: 30,
    required: true,
  })
  @IsString()
  @MinLength(3)
  @MaxLength(30)
  @IsOptional()
  lastname?: string

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

  @ApiProperty({
    description: `Date of last paied mambership fee`,
    required: false,
  })
  @IsString()
  @IsOptional()
  lastMembershipFee: string
}
