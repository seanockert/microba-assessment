// Divide a value into N roughly equal parts and return as an array eg. 10, 3 => [4, 3, 3]
export const divideEqualParts = (value: number, parts: number): number[] => {
  if (parts === 1) {
    return [value];
  }

  const quotient = Math.floor(value / parts);
  const remainder = value % parts;

  return Array.from({ length: parts }, (_, i) => quotient + (i < remainder ? 1 : 0));
};

// Randomise a list of items
export const shuffleArray = (array: any[]) => {
  for (var i = array.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
  
  return array;
};
