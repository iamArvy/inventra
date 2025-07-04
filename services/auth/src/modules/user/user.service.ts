import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { TokenService } from 'src/common/token/token.service';
import { UserRepo } from 'src/db/repositories/user.repo';
import { SecretService } from 'src/common/secret/secret.service';
import { UpdatePasswordData } from 'src/common/dto/app.inputs';
import { Status } from 'src/common/dto/app.response';
import { BaseService } from 'src/common/base/base.service';

@Injectable()
export class UserService extends BaseService {
  constructor(
    private repo: UserRepo,
    private tokenService: TokenService,
    private secret: SecretService,
  ) {
    super();
  }

  async updatePassword(id: string, data: UpdatePasswordData): Promise<Status> {
    try {
      const user = await this.repo.findById(id);
      if (!user) throw new NotFoundException('User not found');
      await this.secret.compare(user.passwordHash, data.oldPassword);
      const hash = await this.secret.create(data.newPassword);
      await this.repo.updatePassword(id, hash);
      return { success: true };
    } catch (error) {
      this.handleError(error, 'UserService.updatePassword');
    }
  }

  async updateEmail(id: string, email: string): Promise<Status> {
    try {
      const user = await this.repo.findById(id);
      if (!user) throw new UnauthorizedException('User not Found');
      await this.repo.updateEmail(id, email);
      await this.repo.updateEmailVerified(id, false);
      return { success: true };
    } catch (error) {
      this.handleError(error, 'UserService.updateEmail');
    }
  }

  async requestEmailVerification(email: string): Promise<Status> {
    try {
      const user = await this.repo.findByEmail(email);
      if (!user) throw new NotFoundException('User not found');
      if (user.emailVerified)
        throw new UnauthorizedException('Email already verified');
      const token = await this.tokenService.generateEmailVerificationToken(
        user.id,
        user.email,
      );

      console.log(token);

      // Here you would typically send a verification email with a link
      // containing a token or code to verify the email.
      return { success: true };
    } catch (error) {
      this.handleError(error, 'UserService.requestEmailVerification');
    }
  }

  async verifyEmail(token: string): Promise<Status> {
    try {
      const { sub, email }: { sub: string; email: string } =
        await this.tokenService.verifyEmailToken(token);
      const user = await this.repo.findById(sub);
      if (!user) throw new NotFoundException('User not found');
      if (user.email !== email)
        throw new BadRequestException(
          'Email from token does not match user email',
        );
      await this.repo.updateEmailVerified(sub, true);
      return { success: true };
    } catch (error) {
      this.handleError(error, 'UserService.verifyEmail');
    }
  }

  async requestPasswordResetToken(
    userId: string,
    email: string,
  ): Promise<Status> {
    try {
      const user = await this.repo.findById(userId);
      if (!user) throw new NotFoundException('User not found');
      if (user.email !== email)
        throw new UnauthorizedException('User Email mismatched');
      const token = await this.tokenService.generatePasswordResetToken(
        user.id,
        user.email,
      );
      console.log(token);
      return { success: true };
    } catch (error) {
      this.handleError(error, 'UserService.requestPasswordResetToken');
    }
  }

  async resetPassword(token: string, password: string): Promise<Status> {
    try {
      const { sub, email }: { sub: string; email: string } =
        await this.tokenService.verifyEmailToken(token);
      const user = await this.repo.findById(sub);
      if (!user) throw new NotFoundException('User not found');
      if (user.email !== email)
        throw new UnauthorizedException('User Email mismatched');
      const hash = await this.secret.create(password);
      await this.repo.updatePassword(user.id, hash);
      return { success: true };
    } catch (error) {
      this.handleError(error, 'UserService.resetPassword');
    }
  }
}
