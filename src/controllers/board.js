import {RenderPosition, render, remove, replace} from '../utils/render.js';
import NoTasksComponent from '../components/no-tasks.js';
import SortComponent from '../components/sort.js';
import TasksComponent from '../components/tasks.js';
import TaskComponent from '../components/task.js';
import TaskEditComponent from '../components/task-edit.js';
import LoadMoreButtonComponent from '../components/load-more-button.js';

const SHOWING_TASKS_COUNT_ON_START = 8;
const SHOWING_TASKS_COUNT_BY_BUTTON = 8;

export default class BoardController {
  constructor(boardComponent) {
    this._boardComponent = boardComponent;

    this._noTasksComponent = new NoTasksComponent();
    this._sortComponent = new SortComponent();
    this._tasksComponent = new TasksComponent();
    this._loadMoreButtonComponent = new LoadMoreButtonComponent();
  }

  _renderTask(task) {
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
    taskComponent.setEditButtonClickHandler(() => {
      replaceTaskToEdit();
      document.addEventListener(`keydown`, onEscKeyDown);
    });

    const taskEditComponent = new TaskEditComponent(task);
    taskEditComponent.setSubmitHandler(replaceEditToTask);

    render(this._tasksComponent.getElement(), taskComponent, RenderPosition.BEFOREEND);
  }

  render(tasks) {
    const isAllTasksArchived = tasks.every((task) => task.isArchive);
    const containerElement = this._boardComponent.getElement();

    if (isAllTasksArchived) {
      render(containerElement, this._noTasksComponent, RenderPosition.BEFOREEND);
    } else {
      render(containerElement, this._sortComponent, RenderPosition.BEFOREEND);
      render(containerElement, this._tasksComponent, RenderPosition.BEFOREEND);

      let showingTasksCount = SHOWING_TASKS_COUNT_ON_START;
      tasks.slice(0, showingTasksCount)
        .forEach((task) => this._renderTask(task));

      render(containerElement, this._loadMoreButtonComponent, RenderPosition.BEFOREEND);

      this._loadMoreButtonComponent.setClickHandler(() => {
        const prevTasksCount = showingTasksCount;
        showingTasksCount = showingTasksCount + SHOWING_TASKS_COUNT_BY_BUTTON;

        tasks.slice(prevTasksCount, showingTasksCount)
          .forEach((task) => this._renderTask(task));

        if (showingTasksCount >= tasks.length) {
          remove(this._loadMoreButtonComponent);
        }
      });
    }
  }
}
