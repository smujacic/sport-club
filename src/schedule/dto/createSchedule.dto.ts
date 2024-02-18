import { ApiProperty } from '@nestjs/swagger'
import { IsNumber } from 'class-validator'
import { DayOfWeek } from '../enum/dayOfWeek.enum'
import { SportClassEntity } from 'src/sport-class/entity/sportClass.entity'

export class CreateScheduleDto {
  @ApiProperty({
    description: 'Sport class duration',
    required: true,
  })
  @IsNumber()
  duration: number

  @ApiProperty({
    description: 'Day of the week',
    enum: DayOfWeek,
    example: DayOfWeek.MONDAY,
    required: true,
  })
  dayOfWeek: DayOfWeek

  @ApiProperty({
    description: 'Schedule time',
    example: '09:30:00',
    required: true,
  })
  time: string

  @ApiProperty({
    type: [SportClassEntity],
    description: 'Sport classes associated with the schedule',
    required: true,
  })
  sportClass: SportClassEntity
}
