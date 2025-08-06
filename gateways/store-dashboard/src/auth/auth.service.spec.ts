import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { AuthGrpcClient } from 'grpc-clients/auth/auth.grpc.client';

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
        { provide: AuthGrpcClient, useFactory: mockAuthClient },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    client = module.get(AuthGrpcClient);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(client).toBeDefined();
  });
});
