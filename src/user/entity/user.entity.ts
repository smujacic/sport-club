import { Column, Entity, JoinTable, ManyToMany, ManyToOne, OneToOne, PrimaryGeneratedColumn } from 'typeorm'
import { UserRoleEntity } from './userRole.entity'
import { UserMetaEntity } from './userMeta.entity'
import { SportClassEntity } from 'src/sport-class/entity/sportClass.entity'

@Entity('user')
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ unique: true, nullable: false })
  email: string

  @Column({ nullable: false })
  password: string

  @Column({ default: false })
  isActive: boolean

  @ManyToOne(() => UserRoleEntity, (role) => role.users, { eager: true })
  role: UserRoleEntity

  @OneToOne(() => UserMetaEntity, (userMeta) => userMeta.user, { eager: true })
  meta: UserMetaEntity

  @ManyToMany(() => SportClassEntity, (sportClass) => sportClass.users)
  @JoinTable({ name: 'user_sport_class' })
  sportClasses: SportClassEntity[]

  toJSON(): Omit<UserEntity, 'password' | 'roleName' | 'toJSON'> {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...userWithoutPassword } = this
    return userWithoutPassword
  }

  /**
   * Get role name
   */
  get roleName(): string {
    return this.role ? this.role.name : null
  }
}
