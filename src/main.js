//bruh
import {generateTasks} from './mocks/task.js';
import {getFilters} from './mocks/filter.js';
import {RenderPosition, render} from './utils/render.js';
import SiteMenuComponent from './components/site-menu.js';
import FilterComponent from './components/filter.js';
import BoardComponent from './components/board.js';
import BoardController from './controllers/board.js';

const TASK_COUNT = 50;

const siteMainElement = document.querySelector(`.main`);
const siteHeaderElement = siteMainElement.querySelector(`.main__control`);

const tasks = generateTasks(TASK_COUNT);
const filters = getFilters(tasks);

const renderSiteComponents = () => {
  render(siteHeaderElement, new SiteMenuComponent(), RenderPosition.BEFOREEND);

  const fragment = document.createDocumentFragment();

  render(fragment, new FilterComponent(filters), RenderPosition.BEFOREEND);

  const boardComponent = new BoardComponent();

  const boardController = new BoardController(boardComponent);
  boardController.render(tasks);

  render(fragment, boardComponent, RenderPosition.BEFOREEND);

  siteMainElement.appendChild(fragment);
};

renderSiteComponents();
