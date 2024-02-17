import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm'
import { UserEntity } from './user.entity'

@Entity('user_role')
export class UserRoleEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column()
  name: string

  @OneToMany(() => UserEntity, (user) => user.role)
  users: UserEntity[]
}
