import { Module } from '@nestjs/common';
import { UsersModule } from 'src/users/users.module';
import { AuthService } from './auth.service';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './strategy/local.strategy';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './constants';
import { JwtStrategy } from './strategy/jwt.strategy';
import { FirebaseStrategy } from './strategy/firebase.strategy';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Auth } from './entitiy/auth.entity';
import { AuthProvider } from './entitiy/auth-provider.entity';

@Module({
  imports: [
    UsersModule,
    PassportModule,
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '60s' },
    }),
    TypeOrmModule.forFeature([Auth, AuthProvider]),
    UsersModule,
  ],
  providers: [AuthService, LocalStrategy, JwtStrategy, FirebaseStrategy],
  controllers: [AuthController],
})
export class AuthModule {}
