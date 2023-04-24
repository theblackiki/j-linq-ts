import { Func, Action, Predicate } from "./funtion-types";

export interface IComparable<T> {
  compareTo(t1: T, t2: T): number;
}

export interface IEnumerable<T> {
  //IEnumerable to IEnumerable
  where(predicate: Predicate<T>): IEnumerable<T>;
  distinct(): IEnumerable<T>;
  select<Tout>(func: Func<T, Tout>): IEnumerable<Tout>;
  except(iterable: Iterable<T>): IEnumerable<T>;
  intersect(iterable: Iterable<T>): IEnumerable<T>;
  //TODO:
  orderBy<Tkey extends number | string | IComparable<Tkey>>(
    func: Func<T, Tkey>
  ): IOrderEnumerable<T>;
  // groupBy(): IGroupEnumerable<T>;
  //selectMany
  //take
  //takeWhile
  //skip
  //skipWhile

  //Execute
  any(predicate: Predicate<T>): boolean;
  all(predicate: Predicate<T>): boolean;
  foreach(action: Action<T>): void;
  foreachRight(action: Action<T>): void;
  firstOrDefault(predicate?: Predicate<T>): T | undefined;
  lastOrDefault(predicate?: Predicate<T>): T | undefined;
  count(predicate?: Predicate<T>): number;
  toArray(): Array<T>;
  toMap<Tkey>(func: Func<T, Tkey>): Map<Tkey, T>;
}

//TODO:下面这两个接口要实现的功能需要再定义两个类
export interface IOrderEnumerable<T> extends IEnumerable<T> {
  thenBy<Tkey extends number | string | IComparable<Tkey>>(
    func: Func<T, Tkey>
  ): IOrderEnumerable<T>;
}
export interface IGroupEnumerable<T> {}
