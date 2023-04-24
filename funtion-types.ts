export type Action<T> = (t: T) => void;
export type Func<Tin, Tout> = (t: Tin) => Tout;
export type Predicate<Tin> = Func<Tin, boolean>;

/**
 * 判断这个对象是否是可迭代的对象
 * @param obj
 * @returns
 */
export function isIterable(obj: any) {
  if (!obj) {
    return false;
  }
  return typeof obj[Symbol.iterator] === "function";
}
