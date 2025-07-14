import { CacheService } from 'src/cache/cache.service';

interface Cacheable {
  cache: CacheService;
}

type CacheKeyFn = (...args: any[]) => string;

export function Cached<T>(ttl: string, keyFn: CacheKeyFn): MethodDecorator {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor,
  ) {
    const originalMethod = descriptor.value as (...args: any[]) => T;

    descriptor.value = async function (this: Cacheable, ...args: string[]) {
      if (!this.cache) {
        throw new Error(
          'CacheService not available on "this". Ensure your class injects CacheService.',
        );
      }
      const cacheKey = keyFn(...args);

      const cached = await this.cache.get<T>(cacheKey);
      if (cached !== undefined) {
        console.log('returning from cache');
        return cached;
      }

      const result = (await originalMethod.apply(this, args)) as (
        ...args: any[]
      ) => Promise<T>;
      await this.cache.set(cacheKey, result, ttl);
      return result;
    };
    return descriptor;
  };
}

// import { CacheService } from 'src/cache/cache.service';

// interface Cacheable {
//   cache: CacheService;
// }

// type CacheKeyFn = (...args: any[]) => string;

// interface CachedOptions<T = any> {
//   ttl?: string;
//   keyFn: CacheKeyFn;
//   shouldCache?: (result: T) => boolean;
//   allowUndefined?: boolean; // whether to cache undefined/null
//   debug?: boolean;
// }

// export function Cached<T>(options: CachedOptions<T>): MethodDecorator {
//   const {
//     ttl = '1h',
//     keyFn,
//     shouldCache,
//     allowUndefined = false,
//     debug = false,
//   } = options;

//   return function (
//     target: any,
//     propertyKey: string,
//     descriptor: PropertyDescriptor,
//   ) {
//     const originalMethod = descriptor.value as (...args: any[]) => Promise<T>;

//     descriptor.value = async function (this: Cacheable, ...args: any[]): Promise<T> {
//       if (!this.cache) {
//         throw new Error(
//           `CacheService not available on "this". Ensure your class injects CacheService.`,
//         );
//       }

//       const keyPrefix = `${target.constructor.name}:${propertyKey}`;
//       const cacheKey = `${keyPrefix}:${keyFn(...args)}`;

//       const cached = await this.cache.get<T>(cacheKey);
//       if (cached !== undefined || (cached === null && allowUndefined)) {
//         if (debug) console.log(`[Cache HIT] ${cacheKey}`);
//         return cached;
//       }

//       if (debug) console.log(`[Cache MISS] ${cacheKey}`);
//       const result = await originalMethod.apply(this, args);

//       const shouldStore = allowUndefined || (result !== undefined && result !== null);
//       const passedCheck = shouldCache ? shouldCache(result) : true;

//       if (shouldStore && passedCheck) {
//         if (debug) console.log(`[Cache SET] ${cacheKey}`);
//         await this.cache.set(cacheKey, result, ttl);
//       } else if (debug) {
//         console.log(`[Cache SKIP] ${cacheKey}`);
//       }

//       return result;
//     };

//     return descriptor;
//   };
// }
