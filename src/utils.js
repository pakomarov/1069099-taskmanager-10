const createTemplateElement = (template) => {
  const templateElement = document.createElement(`template`);
  templateElement.innerHTML = template;
  return templateElement;
};

const render = (container, template, place) => {
  container.insertAdjacentHTML(place, template);
};

// Добавление единицы необходимо, чтобы включить максимальное значение. Math.random() считает от 0 включительно до 1, не включая единицу
const getRandomIntegerInRange = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

const getRandomArrayEntry = (array) => array[getRandomIntegerInRange(0, (array.length - 1))];

const flipCoin = () => Math.random() > 0.5;

const getRandomDateWithinRange = (range) => {
  const randomDate = new Date();
  const sign = flipCoin() ? 1 : -1;
  const diffValue = sign * getRandomIntegerInRange(0, range);

  randomDate.setDate(randomDate.getDate() + diffValue);

  return randomDate;
};

const getShuffledArray = (array) => {
  const shuffledArray = array.slice();

  // Алгоритм: "The Durstenfeld Shuffle" (оптимизированная версия "Fisher–Yates shuffle")
  // Алгоритм работает с конца до начала для простоты расчёта индекса j. 0 < j < i если работать начиная с конца, или i < j < (array.length - 1) если работать с начала
  for (let j, i = shuffledArray.length - 1; i > 0; i--) {
    j = getRandomIntegerInRange(0, i);

    [shuffledArray[j], shuffledArray[i]] = [shuffledArray[i], shuffledArray[j]];
  }

  return shuffledArray;
};

const getRandomSubsetOfArray = (array, length) => getShuffledArray(array).slice(0, length);

export {
  createTemplateElement,
  render,
  getRandomIntegerInRange,
  getRandomArrayEntry,
  flipCoin,
  getRandomDateWithinRange,
  getRandomSubsetOfArray
};
