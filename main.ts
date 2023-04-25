

// console.log("你好");

import { Enumerable } from "./Enumerable";

const arr = Enumerable.From([1, 2, 3, 4])
  .select((x) => x.toString())
  .toArray();

console.log(arr);

Enumerable.From([1,4,5,9,3,2,1]).orderBy(x=>x).thenBy(x=>x);

export {};
