import { Test, TestingModule } from '@nestjs/testing';
import { VariantResolver } from './variant.resolver';

describe('VariantResolver', () => {
  let resolver: VariantResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [VariantResolver],
    }).compile();

    resolver = module.get<VariantResolver>(VariantResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
