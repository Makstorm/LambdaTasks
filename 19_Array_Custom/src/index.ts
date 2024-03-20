interface Array<T> {
  multiply(this: number[], factor?: number): Array<T>;

  all(this: T[], predicate: (value: T) => boolean): boolean;

  any(this: T[], predicate?: (value: T) => boolean): boolean;

  asosiateBy<K>(this: T[], transform: (value: T) => K): Map<K, T>;

  chunked(this: T[], size: number): T[][];

  distinctBy<K>(this: T[], transform: (value: T) => K): T[];

  customFilter(this: T[], predicate: (value: T) => boolean): T[];

  filterNot(this: T[], predicate: (value: T) => boolean): T[];

  filterIndexed(
    this: T[],
    predicate: (value: T, index: number, array: T[]) => boolean
  ): T[];

  customFind(this: T[], predicate: (value: T) => boolean): T[] | -1;

  customFindLast(this: T[], predicate: (value: T) => boolean): T[] | -1;

  flatten(): any[];

  fold<R>(this: T[], acc: R, operation: (acc: R, value: T) => R): R;

  maxBy(selector: (element: T) => number): T | undefined;

  minBy(selector: (element: T) => number): T | undefined;

  count(this: T[], predicate: (value: T) => boolean): number;

  groupBy<K extends keyof any>(selector: (element: T) => K): Record<K, T[]>;
}

Array.prototype.multiply = function (factor: number = 10): number[] {
  const newArr: number[] = [];
  for (let i = 0; i < this.length; i++) {
    newArr[i] = this[i] * factor;
  }

  return newArr;
};

const numArr = [1, 2, 3, 4];
console.log("multiply", numArr.multiply(50));

Array.prototype.all = function <T>(predicate: (value: T) => boolean): boolean {
  for (let item of this) {
    if (!predicate(item)) {
      return false;
    }
  }
  return true;
};

console.log(
  "all",
  numArr.all((val) => typeof val === "number")
);

Array.prototype.any = function <T>(predicate?: (value: T) => boolean): boolean {
  if (predicate) {
    for (let item of this) {
      if (predicate(item)) {
        return true;
      }
    }
  } else {
    return this.length > 0;
  }
  return false;
};

console.log(
  "any",
  numArr.any((val) => val === 2)
);

Array.prototype.asosiateBy = function <T, K>(
  transform: (value: T) => K
): Map<K, T> {
  const map = new Map<K, T>();
  for (const item of this) {
    const key = transform(item);
    map.set(key, item);
  }
  return map;
};

console.log(
  "asosiateBy",
  [
    { id: 1, name: "Max" },
    { id: 2, name: "Max2" },
  ].asosiateBy((val) => val.id)
);

Array.prototype.chunked = function <T>(size: number): T[][] {
  const res: T[][] = [];

  for (let i = 0; i < this.length; i += size) {
    res.push(this.slice(i, i + size));
  }

  return res;
};

console.log("chunked", numArr.chunked(3));

Array.prototype.distinctBy = function <T, K>(transform: (val: T) => K): T[] {
  const seen = new Set<K>();
  const result: T[] = [];
  for (const item of this) {
    const key = transform(item);

    if (!seen.has(key)) {
      seen.add(key);
      result.push(item);
    }
  }

  return result;
};

console.log(
  "distinctBy",
  numArr.distinctBy((val) => val % 2)
);

Array.prototype.customFilter = function <T>(
  predicate: (val: T) => boolean
): T[] {
  const result: T[] = [];

  for (const item of this) {
    if (predicate(item)) {
      result.push(item);
    }
  }

  return result;
};

console.log(
  "filter",
  numArr.customFilter((el) => el === 3)
);

Array.prototype.filterNot = function <T>(predicate: (val: T) => boolean): T[] {
  const result: T[] = [];

  for (const item of this) {
    if (!predicate(item)) {
      result.push(item);
    }
  }

  return result;
};

console.log(
  "filterNot",
  numArr.filterNot((el) => el === 3)
);

Array.prototype.filterIndexed = function <T>(
  this: T[],
  predicate: (value: T, index: number, array: T[]) => boolean
): T[] {
  const result: T[] = [];
  for (let i = 0; i < this.length; i++) {
    if (predicate(this[i], i, this)) {
      result.push(this[i]);
    }
  }
  return result;
};

console.log(
  "filterIndexed",
  numArr.filterIndexed((el, i) => i === el)
);

Array.prototype.customFind = function <T>(
  predicate: (value: T) => boolean
): T | -1 {
  for (let i = 0; i < this.length; i++) {
    if (predicate(this[i])) {
      return this[i];
    }
  }

  return -1;
};

console.log(
  "find",
  numArr.customFind((el) => el === 3)
);

Array.prototype.customFindLast = function <T>(
  predicate: (value: T) => boolean
): T | -1 {
  for (let i = this.length - 1; i >= 0; i--) {
    if (predicate(this[i])) {
      return this[i];
    }
  }

  return -1;
};

console.log(
  "find",
  numArr.customFindLast((el) => el === 0)
);

Array.prototype.flatten = function (): any[] {
  let result: any[] = [];

  const addElements = (arr: any[]) => {
    for (let i = 0; i < arr.length; i++) {
      if (Array.isArray(arr[i])) {
        addElements(arr[i]);
      } else {
        result[result.length] = arr[i];
      }
    }
  };

  addElements(this);
  return result;
};

console.log("flatten", [numArr, numArr, numArr].flatten());

Array.prototype.fold = function <T, R>(
  acc: R,
  operation: (acc: R, val: T) => R
): R {
  let res: R = acc;
  for (const item of this) {
    res = operation(res, item);
  }

  return res;
};

console.log(
  "fold",
  numArr.fold(0, (acc, val) => acc + val)
);

Array.prototype.maxBy = function <T>(
  this: T[],
  selector: (element: T) => number
): T | undefined {
  if (this.length === 0) return undefined;

  let maxElement = this[0];
  let maxValue = selector(maxElement);

  for (let i = 1; i < this.length; i++) {
    const currentElement = this[i];
    const currentValue = selector(currentElement);
    if (currentValue > maxValue) {
      maxValue = currentValue;
      maxElement = currentElement;
    }
  }

  return maxElement;
};

console.log(
  "maxBy",
  numArr.maxBy((el) => el)
);

Array.prototype.minBy = function <T>(
  this: T[],
  selector: (element: T) => number
): T | undefined {
  if (this.length === 0) return undefined;

  let minElement = this[0];
  let minValue = selector(minElement);

  for (let i = 1; i < this.length; i++) {
    const currentElement = this[i];
    const currentValue = selector(currentElement);
    if (currentValue < minValue) {
      minValue = currentValue;
      minElement = currentElement;
    }
  }

  return minElement;
};

console.log(
  "maxBy",
  numArr.minBy((el) => el)
);

Array.prototype.count = function <T>(predicate: (val: T) => boolean): number {
  let count = 0;

  for (const item of this) {
    if (predicate(item)) {
      count++;
    }
  }

  return count;
};

console.log(
  "count",
  numArr.count((el) => el > 1)
);

Array.prototype.groupBy = function <T, K extends keyof any>(
  this: T[],
  selector: (element: T) => K
): Record<K, T[]> {
  const result: Record<K, T[]> = {} as Record<K, T[]>;

  for (let i = 0; i < this.length; i++) {
    const key = selector(this[i]);
    if (!(key in result)) {
      result[key] = [];
    }
    result[key].push(this[i]);
  }
  return result;
};

console.log(
  "groupBy",
  [
    { name: "Alice", age: 30, job: "Developer" },
    { name: "Bob", age: 25, job: "Designer" },
    { name: "Charlie", age: 35, job: "Worker" },
    { name: "Diana", age: 40, job: "Designer" },
  ].groupBy((el) => el.job)
);
