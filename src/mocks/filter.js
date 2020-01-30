import {isDateExpired, isDateToday} from '../utils.js';

const FILTER_TITLES = [
  `All`,
  `Overdue`,
  `Today`,
  `Favorites`,
  `Repeating`,
  `Tags`,
  `Archive`
];

const getFilterCount = (tasks, filterTitle) => {
  let count = 0;

  switch (filterTitle) {
    case `All`:
      count = tasks.length;
      break;
    case `Overdue`:
      for (const task of tasks) {
        count += isDateExpired(task.dueDate) ? 1 : 0;
      }
      break;
    case `Today`:
      for (const task of tasks) {
        count += isDateToday(task.dueDate) ? 1 : 0;
      }
      break;
    case `Favorites`:
      for (const task of tasks) {
        count += task.isFavorite ? 1 : 0;
      }
      break;
    case `Repeating`:
      for (const task of tasks) {
        const {repeatingDays} = task;
        const hasRepeatingDays = Object.values(repeatingDays).some(Boolean);
        count += hasRepeatingDays ? 1 : 0;
      }
      break;
    case `Tags`:
      for (const task of tasks) {
        const hasTags = !!task.tags.size;
        count += hasTags ? 1 : 0;
      }
      break;
    case `Archive`:
      for (const task of tasks) {
        count += task.isArchive ? 1 : 0;
      }
      break;
  }

  return count;
};

const getFilters = (tasks) => {
  return FILTER_TITLES.map((filterTitle) => {
    return {
      title: filterTitle,
      count: getFilterCount(tasks, filterTitle)
    };
  });
};

export {getFilters};
