import { IsString } from 'class-validator'
import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm'
import { SportEntity } from './sport.entity'

@Entity('sport_image')
export class ImageEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ nullable: false, type: 'bytea' })
  image?: Buffer

  @Column({ nullable: false })
  @IsString()
  imageName: string

  @Column()
  @IsString()
  mimetype: string

  @OneToOne(() => SportEntity, (sport) => sport.image)
  sport: SportEntity
}
