import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm'
import { SportClassEntity } from '../../sport-class/entity/sportClass.entity'
import { DayOfWeek } from '../enum/dayOfWeek.enum'

@Entity('schedule')
export class ScheduleEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ nullable: true })
  duration: number

  @Column({ type: 'enum', enum: DayOfWeek, nullable: false })
  dayOfWeek: DayOfWeek

  @Column({ type: 'time', nullable: false })
  time: string

  @OneToMany(() => SportClassEntity, (sportClass) => sportClass.schedule, { eager: true, nullable: false })
  sportClass: SportClassEntity
}
