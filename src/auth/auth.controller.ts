import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common';
import { Get, Inject, Param } from '@nestjs/common/decorators';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import {
  FirebaseAdminSDK,
  FIREBASE_ADMIN_INJECT,
} from '@tfarras/nestjs-firebase-admin';
import { RegisterDto } from './dto/register.dto';
import { UsersService } from 'src/users/users.service';
import { FirebaseUser } from '@tfarras/nestjs-firebase-auth';
import { LoginTokenDto } from './dto/login-token.dto';

@ApiBearerAuth()
@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private usersService: UsersService,
    @Inject(FIREBASE_ADMIN_INJECT) private readonly fireSDK: FirebaseAdminSDK,
  ) {}

  // [ ]: Firebase 아닌 방법은 어떻게 로그인 할지?
  @UseGuards(AuthGuard('firebase'))
  @Post('login')
  async login(@Request() req) {
    const user: FirebaseUser = req.user;
    const { uid, email } = user;
    const auth = await this.authService.findUid(uid);
    return this.authService.login(auth.user.id, email);
  }

  @Post('register')
  async register(@Body() req: RegisterDto) {
    const { uid, name, authProvider, email } = req;
    const user = await this.usersService.create(name);
    return await this.authService.createAuth(user, uid, email, authProvider);
  }

  @Get('uid/:uid')
  async checkIsRegistered(@Param('uid') uid: string) {
    const auth = await this.authService.findUid(uid);
    if (auth) return true;
    return false;
  }

  @Post('login/kakao')
  async loginKakao(@Body() dto: LoginTokenDto) {
    const res = await this.authService.findKakaoProfile(dto.token);
    const auth = await this.authService.findUid(res.sub);
    if (!auth) {
      const user = await this.usersService.create(res.nickname);
      await this.authService.createAuth(
        user,
        res.sub,
        res.email,
        'kakao',
        res.email_verified,
      );
      return this.authService.login(user.id, res.email);
    }
    return this.authService.login(auth.user.id, res.email);
  }
}
