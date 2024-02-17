import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm'
import { UserEntity } from './user.entity'

@Entity('user_meta')
export class UserMetaEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ nullable: false })
  firstname: string

  @Column({ nullable: false })
  lastname: string

  @Column({ nullable: true })
  address?: string

  @Column({ nullable: true })
  oib?: string

  @Column({ type: 'date', nullable: true })
  lastMembershipFee?: Date

  @OneToOne(() => UserEntity, (user) => user.meta)
  @JoinColumn()
  user: UserEntity
}
