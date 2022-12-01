import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt } from 'passport-jwt';
import { FirebaseAuthStrategy } from '@tfarras/nestjs-firebase-auth';
import * as admin from 'firebase-admin';

@Injectable()
export class FirebaseStrategy extends PassportStrategy(
  FirebaseAuthStrategy,
  'firebase',
) {
  public constructor() {
    super({
      extractor: ExtractJwt.fromBodyField('token'),
    });
    // TODO: 글로벌로 하고 싶은데 어쩌지
    admin.initializeApp();
  }
}
