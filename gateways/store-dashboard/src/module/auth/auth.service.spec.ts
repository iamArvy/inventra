import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { AuthClient } from '@grpc-clients/auth/auth.client';

const mockAuthClient = () => ({
  findById: jest.fn(),
});

describe('AuthController', () => {
  let service: AuthService;
  let client: ReturnType<typeof mockAuthClient>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: AuthClient, useFactory: mockAuthClient },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    client = module.get(AuthClient);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(client).toBeDefined();
  });
});
