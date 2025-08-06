import { Test, TestingModule } from '@nestjs/testing';
import { ProductService } from './product.service';
import { mockProductRepo } from 'src/common/mocks';
import { ProductRepository } from './product.repository';

describe('ProductService', () => {
  let service: ProductService;
  let repo: jest.Mocked<ProductRepository>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductService,
        {
          provide: ProductRepository,
          useValue: mockProductRepo,
        },
      ],
    }).compile();

    service = module.get<ProductService>(ProductService);
    repo = module.get(ProductRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(repo).toBeDefined();
  });
});
