import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { UserGrpcClient } from 'grpc-clients/user';

const mockUserClient = () => ({
  findById: jest.fn(),
});

describe('UserService', () => {
  let service: UserService;
  let userClient: ReturnType<typeof mockUserClient>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        { provide: UserGrpcClient, useFactory: mockUserClient },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    userClient = module.get(UserGrpcClient);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(userClient).toBeDefined();
  });
});
