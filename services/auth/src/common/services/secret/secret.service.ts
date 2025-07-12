import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as argon from 'argon2';
import { BaseService } from '../base/base.service';

@Injectable()
export class SecretService extends BaseService {
  constructor() {
    super();
  }

  async compare(hash: string, secret: string): Promise<boolean> {
    const valid = await argon.verify(hash, secret);
    if (!valid) throw new UnauthorizedException('Invalid credentials');
    return true;
  }

  create(input: string) {
    return argon.hash(input);
  }
}
