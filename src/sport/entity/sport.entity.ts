import { Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm'
import { ImageEntity } from './image.entity'
import { SportClassEntity } from '../../sport-class/entity/sportClass.entity'

@Entity('sport')
export class SportEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ unique: true, nullable: false })
  name: string

  @Column()
  description: string

  @Column({ default: true })
  isActive: boolean

  @OneToOne(() => ImageEntity, (image) => image.sport, { eager: true, cascade: true, nullable: true })
  @JoinColumn()
  image?: ImageEntity

  @OneToMany(() => SportClassEntity, (sportClass) => sportClass.sport)
  sportClass: SportClassEntity
}
