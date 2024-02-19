interface SortingOption {
  optionNumber: number;
  execute: (words: string[]) => string[];
}

const isNumber = (str: string) => {
  return !isNaN(Number(str)) && !isNaN(parseFloat(str));
};

const sortByAlphabeticalOrder: SortingOption = {
  optionNumber: 1,
  execute: (words: string[]) => {
    console.log("sortByAlphabeticalOrder");
    const filteredArray: string[] = words.filter((str) => !isNumber(str));
    return filteredArray.sort();
  },
};

const sortBySmallestDigits: SortingOption = {
  optionNumber: 2,
  execute: (words: string[]) => {
    console.log("sortBySmallestDigits");

    const filteredArray: string[] = words.filter((str) => isNumber(str));
    const numericValues: number[] = filteredArray.map(Number);
    const sortedArr = numericValues.sort((a, b) => a - b);

    return sortedArr.map(String);
  },
};

const sortByBiggestDigits: SortingOption = {
  optionNumber: 3,
  execute: (words: string[]) => {
    console.log("sortByBiggestDigits");

    const filteredArray: string[] = words.filter((str) => isNumber(str));
    const numericValues: number[] = filteredArray.map(Number);
    const sortedArr = numericValues.sort((a, b) => b - a);

    return sortedArr.map(String);
  },
};

const sortByLength: SortingOption = {
  optionNumber: 4,
  execute: (words: string[]) => {
    console.log("sortByLength");

    return words.sort((a, b) => a.length - b.length);
  },
};

const sortUnique: SortingOption = {
  optionNumber: 5,
  execute: (words: string[]) => {
    console.log("sortUnique");

    const filteredArray: string[] = words.filter((str) => !isNumber(str));

    const uniqueSet: Set<string> = new Set(filteredArray);

    return [...uniqueSet];
  },
};

export const sortingOptions: SortingOption[] = [
  sortByAlphabeticalOrder,
  sortBySmallestDigits,
  sortByBiggestDigits,
  sortByLength,
  sortUnique,
];
