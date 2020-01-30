import {generateTasks} from './mocks/task.js';
import {getFilters} from './mocks/filter.js';
import {render, RenderPosition} from './utils.js';
import SiteMenuComponent from './components/site-menu.js';
import FilterComponent from './components/filter.js';
import BoardComponent from './components/board.js';
import SortComponent from './components/sort.js';
import TasksComponent from './components/tasks.js';
import TaskEditComponent from './components/task-edit.js';
import TaskComponent from './components/task.js';
import LoadMoreButtonComponent from './components/load-more-button.js';

const TASK_COUNT = 50;
const SHOWING_TASKS_COUNT_ON_START = 8;
const SHOWING_TASKS_COUNT_BY_BUTTON = 8;

const siteMainElement = document.querySelector(`.main`);
const siteHeaderElement = siteMainElement.querySelector(`.main__control`);

const tasks = generateTasks(TASK_COUNT);
const filters = getFilters(tasks);

const renderSiteComponents = () => {
  render(siteHeaderElement, new SiteMenuComponent().getElement(), RenderPosition.BEFOREEND);

  const fragment = document.createDocumentFragment();

  render(fragment, new FilterComponent(filters).getElement(), RenderPosition.BEFOREEND);

  const boardComponent = new BoardComponent();
  render(fragment, boardComponent.getElement(), RenderPosition.BEFOREEND);

  render(boardComponent.getElement(), new SortComponent().getElement(), RenderPosition.BEFOREEND);

  const tasksComponent = new TasksComponent();
  render(boardComponent.getElement(), tasksComponent.getElement(), RenderPosition.BEFOREEND);

  render(tasksComponent.getElement(), new TaskEditComponent(tasks[0]).getElement(), RenderPosition.BEFOREEND);

  let showingTasksCount = SHOWING_TASKS_COUNT_ON_START;
  tasks.slice(1, showingTasksCount)
    .forEach((task) => render(tasksComponent.getElement(), new TaskComponent(task).getElement(), RenderPosition.BEFOREEND));

  const loadMoreButtonComponent = new LoadMoreButtonComponent();
  render(boardComponent.getElement(), loadMoreButtonComponent.getElement(), RenderPosition.BEFOREEND);

  loadMoreButtonComponent.getElement().addEventListener(`click`, () => {
    const prevTasksCount = showingTasksCount;
    showingTasksCount = showingTasksCount + SHOWING_TASKS_COUNT_BY_BUTTON;

    tasks.slice(prevTasksCount, showingTasksCount)
      .forEach((task) => render(tasksComponent.getElement(), new TaskComponent(task).getElement(), RenderPosition.BEFOREEND));

    if (showingTasksCount >= tasks.length) {
      loadMoreButtonComponent.getElement().remove();
      loadMoreButtonComponent.removeElement();
    }
  });

  siteMainElement.appendChild(fragment);
};

renderSiteComponents();
