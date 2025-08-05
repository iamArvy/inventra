import { Test, TestingModule } from '@nestjs/testing';
import { ProductService } from './product.service';
import {
  ProductRepository,
  StoreRepository,
  VariantRepository,
} from 'src/db/repository';
import {
  mockProductRepo,
  mockStoreRepo,
  mockVariantRepo,
} from 'src/common/mocks';

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
        {
          provide: VariantRepository,
          useValue: mockVariantRepo,
        },
        {
          provide: StoreRepository,
          useValue: mockStoreRepo,
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
