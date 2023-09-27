
const missingNum: number[] = [1, 4, 6, 6, 5, 3, 7, 3, 7, 1, 2, 4];
const hashMap: { [key: number]: number } = {};
missingNum.forEach((num) => {
  hashMap[num] = hashMap[num] ? hashMap[num] + 1 : 1;
});
console.log(hashMap);