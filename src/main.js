import {createTemplateElement, render} from './utils.js';
import {createSiteMenuTemplate} from './components/site-menu.js';
import {createFiltersMarkup} from './components/filter.js';
import {createBoardTemplate} from './components/board.js';
import {createSortingTemplate} from './components/sorting.js';
import {createTaskMarkup} from './components/task.js';
import {createTaskEditMarkup} from './components/task-edit.js';
import {createLoadMoreButtonTemplate} from './components/load-more-button.js';
import {generateTasks} from './mocks/task.js';
import {generateFilters} from './mocks/filter.js';

const TASK_COUNT = 50;
const SHOWING_TASKS_COUNT_ON_START = 8;
const SHOWING_TASKS_COUNT_BY_BUTTON = 8;

const siteMainElement = document.querySelector(`.main`);
const siteHeaderElement = siteMainElement.querySelector(`.main__control`);

const tasks = generateTasks(TASK_COUNT);
const filters = generateFilters(tasks);

const renderSiteComponents = () => {
  render(siteHeaderElement, createSiteMenuTemplate(), `beforeend`);

  const fragment = document.createDocumentFragment();

  const filterTemplateElement = createTemplateElement(createFiltersMarkup(filters));
  fragment.appendChild(filterTemplateElement.content);

  const boardTemplateElement = createTemplateElement(createBoardTemplate());
  fragment.appendChild(boardTemplateElement.content);

  const boardElement = fragment.querySelector(`.board`);
  render(boardElement, createSortingTemplate(), `afterbegin`);

  const taskListElement = boardElement.querySelector(`.board__tasks`);
  render(taskListElement, createTaskEditMarkup(tasks[0]), `beforeend`);
  let showingTasksCount = SHOWING_TASKS_COUNT_ON_START;
  tasks.slice(1, showingTasksCount).forEach((task) => render(taskListElement, createTaskMarkup(task), `beforeend`));


  render(boardElement, createLoadMoreButtonTemplate(), `beforeend`);

  const loadMoreButton = boardElement.querySelector(`.load-more`);
  loadMoreButton.addEventListener(`click`, () => {
    const prevTasksCount = showingTasksCount;
    showingTasksCount = showingTasksCount + SHOWING_TASKS_COUNT_BY_BUTTON;

    tasks.slice(prevTasksCount, showingTasksCount)
      .forEach((task) => render(taskListElement, createTaskMarkup(task), `beforeend`));

    if (showingTasksCount >= tasks.length) {
      loadMoreButton.remove();
    }
  });

  siteMainElement.appendChild(fragment);
};

renderSiteComponents();
