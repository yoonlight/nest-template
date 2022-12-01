import { CommonEntity } from 'src/common/common.entitiy';
import { Entity, Column, OneToMany } from 'typeorm';
import { Auth } from './auth.entity';

@Entity()
export class AuthProvider extends CommonEntity {
  @Column()
  name: string;

  @OneToMany(() => Auth, (auth) => auth)
  auth: Auth[];
}
