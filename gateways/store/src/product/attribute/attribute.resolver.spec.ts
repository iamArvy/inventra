import { Test, TestingModule } from '@nestjs/testing';
import { AttributeResolver } from './attribute.resolver';

describe('AttributeResolver', () => {
  let resolver: AttributeResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AttributeResolver],
    }).compile();

    resolver = module.get<AttributeResolver>(AttributeResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
