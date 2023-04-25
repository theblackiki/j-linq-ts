import { Action, Func, Predicate, TComparable } from "./funtion-types";
import { IComparable, IEnumerable, IOrderEnumerable } from "./interface";
import { isIterable } from "./funtion-types";

/**
 * 接口使用Linq方式，内部使用生成器来实现IEnumerable
 */
export class Enumerable<T> implements IEnumerable<T>, Iterable<T> {
  static From<T>(arr: Iterable<T>): IEnumerable<T> {
    return new Enumerable(arr);
  }

  [Symbol.iterator](): Iterator<T, T, T | undefined> {
    // TODO:实现迭代器
    throw new Error("Method not implemented.");
  }

  /**
   * 储存计算逻辑的生成器
   */
  protected generator!: Generator<T>;

  protected constructor(param: Iterable<T> | Generator<T>) {
    if (isIterable(param)) {
      this.generator = this.generate(param);
    } else {
      this.generator = param as Generator<T>;
    }
  }

  where(predicate: Predicate<T>) {
    this.generator = this.internalWhere(this.generator, predicate);
    return this;
  }

  select<Tout>(func: Func<T, Tout>) {
    const generator = this.internalSelect(this.generator, func);
    return new Enumerable(generator);
  }

  distinct() {
    const set = new Set<T>();
    for (const current of this.generator) {
      set.add(current);
    }
    return new Enumerable(this.generate(set));
  }

  /**
   * 将当前生成的元素-外部传回的元素
   * @param iterable 如果为空，则直接返回所有
   * @returns
   */
  except(iterable: Iterable<T>): IEnumerable<T> {
    this.generator = this.internalExcept(this.generator, iterable);
    return this;
  }

  /**
   * 当前生成的元素和外部传入的元素的交集
   * @param iterable 如果为空，则不会迭代返回任何元素
   * @returns
   */
  intersect(iterable: Iterable<T>): IEnumerable<T> {
    this.generator = this.internalIntersect(this.generator, iterable);
    return this;
  }

  /**
   * 按照返回类型Tkey的排序规则对原数据进行排序
   * @param func
   * @returns
   */
  orderBy<Tkey extends number | string | IComparable<Tkey>>(func: Func<T, Tkey> ): IOrderEnumerable<T> {
    //TODO:按照类型排序,orderBy和thenBy的优先级关系应该如何确定

    return new OrderEnumerable<T, Tkey>(this.generator, func);
  }

  //---------------Excecute-----------------

  any(predicate: Predicate<T>) {
    for (const current of this.generator) {
      if (predicate(current)) {
        return true;
      }
    }
    return false;
  }

  all(predicate: Predicate<T>) {
    for (const current of this.generator) {
      if (!predicate(current)) {
        return false;
      }
    }
    return true;
  }

  count(predicate?: Predicate<T>) {
    let _count = 0;
    if (!predicate) {
      for (const _ of this.generator) {
        _count += 1;
      }
      return _count;
    }
    for (const current of this.generator) {
      if (predicate(current)) {
        _count += 1;
      }
    }
    return _count;
  }

  firstOrDefault(predicate?: Predicate<T>) {
    if (!predicate) {
      for (const current of this.generator) {
        return current;
      }
      return undefined;
    }
    for (const current of this.generator) {
      if (predicate(current)) {
        return current;
      }
    }
    return undefined;
  }

  lastOrDefault(predicate?: Predicate<T>) {
    let lastElement: T | undefined = undefined;
    if (!predicate) {
      for (const current of this.generator) {
        lastElement = current;
      }
      return lastElement;
    }
    for (const current of this.generator) {
      if (predicate(current)) {
        lastElement = current;
      }
    }
    return lastElement;
  }

  foreach(action: Action<T>) {
    for (const current of this.generator) {
      action(current);
    }
  }

  foreachRight(action: Action<T>) {
    const _arr = this.toArray();
    for (let i = _arr.length - 1; i >= 0; i--) {
      action(_arr[i]);
    }
  }

  toArray() {
    const res: T[] = [];
    for (const current of this.generator) {
      res.push(current);
    }
    return res;
  }

  /**
   * 在使用之前，必须要自己明确Key是否有重复，因为Key重复会被直接覆盖
   * @param func
   * @returns
   */
  toMap<Tkey>(func: Func<T, Tkey>) {
    const map = new Map<Tkey, T>();
    for (const current of this.generator) {
      map.set(func(current), current);
    }
    return map;
  }

  //-----------------------internal method------------------------------
  //-----------------------real implements------------------------------

  /**
   * 根据数组返回生成器
   * @param arr 可迭代类型参数
   */
  private *generate(arr: Iterable<T>) {
    for (const current of arr) {
      yield current;
    }
  }

  private *internalWhere(generator: Generator<T>, predicate: Predicate<T>) {
    for (const current of generator) {
      if (predicate(current)) {
        yield current;
      }
    }
  }

  private *internalSelect<Tout>(generator: Generator<T>, func: Func<T, Tout>) {
    for (const current of generator) {
      yield func(current);
    }
  }

  private *internalExcept(generator: Generator<T>, iterable: Iterable<T>) {
    if (!iterable) {
      for (const self_item of generator) {
        yield self_item;
      }
      return;
    }
    const set = new Set<T>();
    for (const item of iterable) {
      set.add(item);
    }
    for (const self_item of generator) {
      if (!set.has(self_item)) {
        yield self_item;
      }
    }
  }

  private *internalIntersect(generator: Generator<T>, iterable: Iterable<T>) {
    if (!iterable) {
      return;
    }
    const set = new Set();
    for (const current of iterable) {
      set.add(current);
    }
    for (const item_self of this.generator) {
      if (set.has(item_self)) {
        yield item_self;
      }
    }
  }

  /**
   * 内部排序逻辑
   * @param arr 
   */
  private *internalSort(arr:Iterator<TComparable<T>>):Iterator<TComparable<T>>{
    const res :TComparable<T>[]= new Array<TComparable<T>>();
    if(arr as Iterator<string>){

    }
    else if(arr as Iterator<number>){

    }
    else{ // arr as Iterator<IComparable<T>>

    }
    for(const current of res){
      yield current;
    }
  }

}

/**
 * 这个是内部实现排序功能的可迭代类，不对外暴露
 */
class OrderEnumerable<T, Tkey> extends Enumerable<T> implements IOrderEnumerable<T>
{
  constructor(iterator: Iterable<T>,public func: Func<T, Tkey>) {
    super(iterator);
  }
  thenBy<Tkey1>(func1:Func<T,Tkey1>): IOrderEnumerable<T> {
    return new OrderEnumerable<T,Tkey1>(this.generator,func1);
  }
}
