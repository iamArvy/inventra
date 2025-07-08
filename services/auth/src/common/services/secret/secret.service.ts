import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as argon from 'argon2';
import { BaseService } from '../base/base.service';

@Injectable()
export class SecretService extends BaseService {
  constructor() {
    super();
  }

  async compare(hash: string, secret: string): Promise<boolean> {
    try {
      const valid = await argon.verify(hash, secret);
      if (!valid) throw new UnauthorizedException('Invalid credentials');
      return true;
    } catch (error) {
      this.handleError(error, 'SecretService.compare');
    }
  }

  create(input: string) {
    return argon.hash(input);
  }
}
