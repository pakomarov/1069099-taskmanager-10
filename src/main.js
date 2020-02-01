import {generateTasks} from './mocks/task.js';
import {getFilters} from './mocks/filter.js';
import {RenderPosition, render, remove, replace} from './utils/render.js';
import SiteMenuComponent from './components/site-menu.js';
import FilterComponent from './components/filter.js';
import BoardComponent from './components/board.js';
import SortComponent from './components/sort.js';
import TasksComponent from './components/tasks.js';
import NoTasksComponent from './components/no-tasks.js';
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

const renderTask = (containerElement, task) => {
  const onEscKeyDown = (evt) => {
    const isEscKey = evt.key === `Escape` || evt.key === `Esc`;

    if (isEscKey) {
      replaceEditToTask();
      document.removeEventListener(`keydown`, onEscKeyDown);
    }
  };

  const replaceEditToTask = () => {
    replace(taskComponent, taskEditComponent);
  };

  const replaceTaskToEdit = () => {
    replace(taskEditComponent, taskComponent);
  };

  const taskComponent = new TaskComponent(task);
  const editButton = taskComponent.getElement().querySelector(`.card__btn--edit`);

  editButton.addEventListener(`click`, () => {
    replaceTaskToEdit();
    document.addEventListener(`keydown`, onEscKeyDown);
  });

  const taskEditComponent = new TaskEditComponent(task);
  const editForm = taskEditComponent.getElement().querySelector(`form`);
  editForm.addEventListener(`submit`, replaceEditToTask);

  render(containerElement, taskComponent, RenderPosition.BEFOREEND);
};

const renderBoard = (boardComponent, tasks) => {
  const isAllTasksArchived = tasks.every((task) => task.isArchive);
  const boardElement = boardComponent.getElement();

  if (isAllTasksArchived) {
    render(boardElement, new NoTasksComponent(), RenderPosition.BEFOREEND);
  } else {
    render(boardElement, new SortComponent(), RenderPosition.BEFOREEND);

    const tasksComponent = new TasksComponent();
    render(boardElement, tasksComponent, RenderPosition.BEFOREEND);

    let showingTasksCount = SHOWING_TASKS_COUNT_ON_START;
    tasks.slice(0, showingTasksCount)
      .forEach((task) => {
        renderTask(tasksComponent.getElement(), task);
      });

    const loadMoreButtonComponent = new LoadMoreButtonComponent();
    render(boardElement, loadMoreButtonComponent, RenderPosition.BEFOREEND);

    loadMoreButtonComponent.getElement().addEventListener(`click`, () => {
      const prevTasksCount = showingTasksCount;
      showingTasksCount = showingTasksCount + SHOWING_TASKS_COUNT_BY_BUTTON;

      tasks.slice(prevTasksCount, showingTasksCount)
        .forEach((task) => {
          renderTask(tasksComponent.getElement(), task);
        });

      if (showingTasksCount >= tasks.length) {
        remove(loadMoreButtonComponent);
      }
    });
  }
};

const renderSiteComponents = () => {
  render(siteHeaderElement, new SiteMenuComponent(), RenderPosition.BEFOREEND);

  const fragment = document.createDocumentFragment();

  render(fragment, new FilterComponent(filters), RenderPosition.BEFOREEND);

  const boardComponent = new BoardComponent();
  renderBoard(boardComponent, tasks);

  render(fragment, boardComponent, RenderPosition.BEFOREEND);

  siteMainElement.appendChild(fragment);
};

renderSiteComponents();
