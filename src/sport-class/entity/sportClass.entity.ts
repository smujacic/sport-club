import { SportEntity } from '../../sport/entity/sport.entity'
import { Column, Entity, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import { ScheduleEntity } from '../../schedule/entity/schedule.entity'
import { UserEntity } from '../../user/entity/user.entity'

@Entity('sport-class')
export class SportClassEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ nullable: false })
  name: string

  @Column({ nullable: false })
  description: string

  @ManyToOne(() => SportEntity, (sport) => sport.sportClass)
  sport: SportEntity

  @ManyToOne(() => ScheduleEntity, (schedule) => schedule.sportClass)
  schedule: ScheduleEntity

  @ManyToMany(() => UserEntity, (user) => user.sportClasses, { eager: true })
  users: UserEntity[]
}
