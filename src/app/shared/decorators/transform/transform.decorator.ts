import { plainToInstance } from 'class-transformer';

/** 메서드의 첫 번째 인자를 지정된 DTO 클래스의 인스턴스로 변환하는 데코레이터 */
export function TransformToDto<T>(dtoClass: new () => T): MethodDecorator {
  return (target, propertyKey, descriptor: TypedPropertyDescriptor<any>) => {

    // 원래 메서드를 저장
    const originalMethod = descriptor.value;

    // 메서드인지 확인
    if (typeof originalMethod !== 'function') {
      throw new Error('TransformToDto can only be applied to methods.');
    }

    // descriptor.value를 덮어씀
    descriptor.value = function(...args: any[]) {
      if (args.length > 0 && args[0] instanceof Object) {
        // 첫 번째 인자를 DTO로 변환
        args[0] = plainToInstance(dtoClass, args[0]);
      }

      // 원래 메서드를 호출하고 결과 반환
      return originalMethod.apply(this, args);
    };

    return descriptor; // 수정된 descriptor 반환
  };
}
