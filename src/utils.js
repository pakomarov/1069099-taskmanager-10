import {REGEXP_SPACES} from './const.js';

const RenderPosition = {
  AFTERBEGIN: `afterbegin`,
  BEFOREEND: `beforeend`
};

const createElement = (template) => {
  const newElement = document.createElement(`div`);
  newElement.innerHTML = template;

  return newElement.firstChild;
};

const render = (container, element, place) => {
  switch (place) {
    case RenderPosition.AFTERBEGIN:
      container.prepend(element);
      break;
    case RenderPosition.BEFOREEND:
      container.append(element);
      break;
  }
};

// Добавление единицы необходимо, чтобы включить максимальное значение. Math.random() считает от 0 включительно до 1, не включая единицу
const getRandomBetween = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

const getRandomArrayEntry = (array) => array[getRandomBetween(0, (array.length - 1))];

const flipCoin = () => Math.random() > 0.5;

const getRandomDateWithinRange = (range) => {
  const randomDate = new Date();
  const sign = flipCoin() ? 1 : -1;
  const diffValue = sign * getRandomBetween(0, range);

  randomDate.setDate(randomDate.getDate() + diffValue);

  return randomDate;
};

const getShuffledArray = (array) => {
  const shuffledArray = array.slice();

  // Алгоритм: "The Durstenfeld Shuffle" (оптимизированная версия "Fisher–Yates shuffle")
  // Алгоритм работает с конца до начала для простоты расчёта индекса j. 0 < j < i если работать начиная с конца, или i < j < (array.length - 1) если работать с начала
  for (let i = shuffledArray.length - 1; i > 0; i--) {
    const j = getRandomBetween(0, i);
    [shuffledArray[j], shuffledArray[i]] = [shuffledArray[i], shuffledArray[j]];
  }

  return shuffledArray;
};

const getRandomSubsetOfArray = (array, length) => getShuffledArray(array).slice(0, length);

const castTimeFormat = (value) => String(value).padStart(2, `0`);

const formatTime = (date) => {
  const hours = castTimeFormat(date.getHours() % 12);
  const minutes = castTimeFormat(date.getMinutes());

  const interval = date.getHours() > 11 ? `pm` : `am`;

  return `${hours}:${minutes} ${interval}`;
};

const isDateExpired = (date) => date instanceof Date && date < Date.now();

const isDateToday = (date) => date instanceof Date && date.toDateString() === (new Date()).toDateString();

const joinMapped = (data, createMarkup, delimiter = ``) => data
  .map(createMarkup)
  .join(delimiter);

const removeSpaces = (text) => text.replace(REGEXP_SPACES, ``);

export {
  RenderPosition,
  createElement,
  render,
  getRandomBetween,
  getRandomArrayEntry,
  flipCoin,
  getRandomDateWithinRange,
  getRandomSubsetOfArray,
  formatTime,
  isDateExpired,
  isDateToday,
  joinMapped,
  removeSpaces
};
