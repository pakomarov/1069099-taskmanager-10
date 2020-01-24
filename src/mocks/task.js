import {
  getRandomIntegerInRange,
  getRandomArrayEntry,
  flipCoin,
  getRandomDateWithinRange,
  getRandomSubsetOfArray
} from '../utils.js';
import {COLORS} from '../const.js';

const DESCRIPTION_ITEMS = [
  `Изучить теорию`,
  `Сделать домашку`,
  `Пройти интенсив на соточку`
];
const DUE_DATE_RANGE = 7;
const DEFAULT_REPEATING_DAYS = {
  'mo': false,
  'tu': false,
  'we': false,
  'th': false,
  'fr': false,
  'sa': false,
  'su': false
};
const TAGS_COUNT_MIN = 0;
const TAGS_COUNT_MAX = 3;
const TAGS = [
  `homework`,
  `theory`,
  `practice`,
  `intensive`,
  `keks`
];

const generateDescription = () => getRandomArrayEntry(DESCRIPTION_ITEMS);

const generateDueDate = () => flipCoin() ? null : getRandomDateWithinRange(DUE_DATE_RANGE);

const generateRepeatingDays = () => ({
  'mo': flipCoin(),
  'tu': flipCoin(),
  'we': flipCoin(),
  'th': flipCoin(),
  'fr': flipCoin(),
  'sa': flipCoin(),
  'su': flipCoin(),
});

const generateTags = () => {
  let numberOfTags = getRandomIntegerInRange(TAGS_COUNT_MIN, TAGS_COUNT_MAX);
  numberOfTags = numberOfTags > TAGS.length ? TAGS.length : numberOfTags;
  const randomSubsetOfArray = getRandomSubsetOfArray(TAGS, numberOfTags);
  return new Set(randomSubsetOfArray);
};

const generateColor = () => getRandomArrayEntry(COLORS);

const generateFavorState = () => flipCoin();

const generateArchiveState = () => flipCoin();

const generateTask = () => {
  const dueDate = generateDueDate();

  return {
    description: generateDescription(),
    dueDate,
    repeatingDays: dueDate ? DEFAULT_REPEATING_DAYS : generateRepeatingDays(),
    tags: generateTags(),
    color: generateColor(),
    isFavorite: generateFavorState(),
    isArchive: generateArchiveState()
  };
};

const generateTasks = (count) => {
  return new Array(count)
    .fill(``)
    .map(generateTask);
};

export {generateTasks};
