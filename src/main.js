import {createTemplateElement, render} from './utils.js';
import {createSiteMenuTemplate} from './components/site-menu.js';
import {createFilterTemplate} from './components/filter.js';
import {createBoardTemplate} from './components/board.js';
import {createSortingTemplate} from './components/sorting.js';
import {createTaskTemplate} from './components/task.js';
import {createTaskEditTemplate} from './components/task-edit.js';
import {createLoadMoreButtonTemplate} from './components/load-more-button.js';

const TASK_COUNT = 3;

const siteMainElement = document.querySelector(`.main`);
const siteHeaderElement = siteMainElement.querySelector(`.main__control`);

const renderSiteComponents = () => {
  render(siteHeaderElement, createSiteMenuTemplate(), `beforeend`);

  const fragment = document.createDocumentFragment();

  const filterTemplateElement = createTemplateElement(createFilterTemplate());
  fragment.appendChild(filterTemplateElement.content);

  const boardTemplateElement = createTemplateElement(createBoardTemplate());
  fragment.appendChild(boardTemplateElement.content);

  const boardElement = fragment.querySelector(`.board`);
  render(boardElement, createSortingTemplate(), `afterbegin`);

  const taskListElement = boardElement.querySelector(`.board__tasks`);
  render(taskListElement, createTaskEditTemplate(), `beforeend`);

  for (let i = 0; i < TASK_COUNT; i++) {
    render(taskListElement, createTaskTemplate(), `beforeend`);
  }

  render(boardElement, createLoadMoreButtonTemplate(), `beforeend`);

  siteMainElement.appendChild(fragment);
};

renderSiteComponents();
