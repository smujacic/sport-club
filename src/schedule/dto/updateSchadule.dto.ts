import { ApiProperty } from '@nestjs/swagger'
import { IsNumber, IsOptional } from 'class-validator'
import { DayOfWeek } from '../enum/dayOfWeek.enum'
import { SportClassEntity } from '../../sport-class/entity/sportClass.entity'

export class UpdateScheduleDto {
  @ApiProperty({
    description: 'Sport class duration',
    required: false,
  })
  @IsNumber()
  @IsOptional()
  duration?: number

  @ApiProperty({
    description: 'Day of the week',
    enum: DayOfWeek,
    example: DayOfWeek.MONDAY,
    required: false,
  })
  @IsOptional()
  dayOfWeek?: DayOfWeek

  @ApiProperty({
    description: 'Schedule time',
    example: '09:30:00',
    required: false,
  })
  @IsOptional()
  time?: string

  @ApiProperty({
    type: [SportClassEntity],
    description: 'Sport classes associated with the schedule',
    required: false,
  })
  @IsOptional()
  sportClass?: SportClassEntity
}
