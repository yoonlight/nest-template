import { Auth } from 'src/auth/entitiy/auth.entity';
import { CommonEntity } from 'src/common/common.entitiy';
import { Entity, Column, OneToMany } from 'typeorm';

@Entity()
export class User extends CommonEntity {
  @Column()
  username: string;

  @Column({ default: null })
  password?: string;

  @OneToMany(() => Auth, (auth) => auth.user)
  auth: Auth[];
}
