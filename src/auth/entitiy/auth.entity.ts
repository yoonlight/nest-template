import { CommonEntity } from 'src/common/common.entitiy';
import { User } from 'src/users/entities/user.entity';
import { Entity, Column, ManyToOne } from 'typeorm';
import { AuthProvider } from './auth-provider.entity';

@Entity()
export class Auth extends CommonEntity {
  @Column()
  uid: string;

  @Column()
  email: string;

  @ManyToOne(() => AuthProvider, (authProvier) => authProvier.auth)
  authProvier: AuthProvider;

  @Column({ default: false })
  emailVerified: boolean;

  @ManyToOne(() => User, (user) => user.auth)
  user: User;
}
