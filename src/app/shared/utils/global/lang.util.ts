/** 값이 비었는지 확인한다. */
export function isEmpty(value: any): boolean {
  return value === null || value === undefined || value === '';
}

/** 값이 있는지 확인한다. */
export function isNotEmpty(value: any): boolean {
  return !isEmpty(value);
}

/** 문자열 값이 비었는지 확인한다. */
export function isBlank(value: string): boolean {
  return isEmpty(value) || value.trim().length === 0;
}

/** 문자열 값이 있는지 확인한다. */
export function isNotBlank(value: string): boolean {
  return !isBlank(value);
}

/** 객체가 비었는지 확인한다. */
export function isObjectEmpty(value: object): boolean {
  return isEmpty(value) || Object.keys(value).length === 0;
}

/** 객체가 비었는지 확인한다. */
export function isNotObjectEmpty(value: object): boolean {
  return !isObjectEmpty(value);
}

/** 깊은 복사를 해서 반환한다. */
export function deepCopy(value: any): any {
  return structuredClone(value);
}

/** 객체 배열을 key 기준으로 group by해서 반환한다. */
export function groupBy<T>(arr: T[], key: string): T[] {
  return [
    ...new Map(arr.reverse().map((obj) => [obj[key], obj])).values()
  ] as T[];
}
