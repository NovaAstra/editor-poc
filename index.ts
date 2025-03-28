import { ellipsis } from "./ellipsis"


setTimeout(() => {
  ellipsis(document.querySelector('.ellipsis')).html()
}, 2000)



const move = (elements: Array<number>) => {

  if (elements.length === 0)
    return -1;

  let low = 0;
  let high = elements.length - 1;

  while (low <= high) {
    let middle = low + ((high - low) >> 1);

    if (elements[middle] <= 2) {
      low = middle + 1;
    } else {
      high = middle - 1
    }
  }

  return high;
}


// console.log(move([1, 2, 3, 4, 5]))