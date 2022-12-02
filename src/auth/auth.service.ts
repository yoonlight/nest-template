import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Auth } from './entitiy/auth.entity';
import { Repository } from 'typeorm';
import { AuthProvider } from './entitiy/auth-provider.entity';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    @InjectRepository(Auth)
    private readonly authRepo: Repository<Auth>,
    @InjectRepository(AuthProvider)
    private readonly authProviderRepo: Repository<AuthProvider>,
  ) {}

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.usersService.findUser(username);
    if (user && user.password === pass) {
      const { username, id } = user;
      return { username, id };
    }
    return null;
  }

  async login(userId: number, email: string) {
    const payload = { email, userId };
    return {
      accessToken: this.jwtService.sign(payload),
    };
  }

  async validateUid(uid: string) {
    const auth = await this.authRepo.findOne({
      where: { uid },
      relations: ['user'],
    });
    return auth.user.id;
  }

  findUid(uid: string) {
    return this.authRepo.findOne({ where: { uid } });
  }

  async createAuth(
    user: User,
    uid: string,
    email: string,
    authProviderName: string,
  ) {
    const authProvider = await this.authProviderRepo.findOne({
      where: { name: authProviderName },
    });
    const auth = new Auth();
    auth.email = email;
    auth.uid = uid;
    auth.authProvier = authProvider;
    auth.user = user;
    this.authRepo.insert(auth);
  }

  async findKakaoProfile(accessToken: string): Promise<{
    sub: string;
    nickname: string;
    email: string;
    email_verified: boolean;
  }> {
    return fetch('https://kapi.kakao.com/v1/oidc/userinfo', {
      // return fetch('https://kapi.kakao.com/v2/user/me', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
      },
    }).then((res) => res.json());
  }
}
