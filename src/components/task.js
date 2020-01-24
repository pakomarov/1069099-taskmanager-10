import {MONTH_NAMES} from '../const.js';
import {formatTime} from '../utils.js';

const CONTROL_DISABLE_CLASS = `card__btn--disabled`;
const TASK_REPEAT_CLASS = `card--repeat`;
const TASK_EXPIRED_CLASS = `card--deadline`;

const createControlMarkup = (task) => {
  const {isArchive, isFavorite} = task;

  const archiveClass = isArchive ? CONTROL_DISABLE_CLASS : ``;
  const favoriteClass = isFavorite ? CONTROL_DISABLE_CLASS : ``;

  return `<div class="card__control">
    <button type="button" class="card__btn card__btn--edit">
      edit
    </button>
    <button
      type="button"
      class="card__btn card__btn--archive ${archiveClass}"
    >
      archive
    </button>
    <button
      type="button"
      class="card__btn card__btn--favorites ${favoriteClass}"
    >
      favorites
    </button>
  </div>`;
};

const createDescriptionMarkup = (task) => {
  const {description} = task;

  return `<div class="card__textarea-wrap">
    <p class="card__text">${description}</p>
  </div>`;
};

const createDueDateMarkup = (task) => {
  const {dueDate} = task;

  const isDateShowing = !!dueDate;
  if (!isDateShowing) {
    return ``;
  }

  const date = `${dueDate.getDate()} ${MONTH_NAMES[dueDate.getMonth()]}`;
  const time = formatTime(dueDate);

  return `<div class="card__dates">
    <div class="card__date-deadline">
      <p class="card__input-deadline-wrap">
        <span class="card__date">${date}</span>
        <span class="card__time">${time}</span>
      </p>
    </div>
  </div>`;
};

const createTagMarkup = (initialText) => {
  // Убирает пробелы (https://stackoverflow.com/questions/5963182/how-to-remove-spaces-from-a-string-using-javascript)
  const editedText = initialText.replace(/\s+/g, ``);

  return `<span class="card__hashtag-inner">
    <span class="card__hashtag-name">
      #${editedText}
    </span>
  </span>`;
};

const createTagsMarkup = (task) => {
  const {tags: setOfTags} = task;
  const arrayOfTags = [...setOfTags];
  const areTagsShowing = !!arrayOfTags.length;
  if (!areTagsShowing) {
    return ``;
  }

  return `<div class="card__hashtag">
    <div class="card__hashtag-list">
      ${arrayOfTags
        .map(createTagMarkup)
        .join(`\n`)}
    </div>
  </div>`;
};

const createTaskMarkup = (task) => {
  const {color, repeatingDays, dueDate} = task;

  const hasRepeatingDays = Object.values(repeatingDays).some(Boolean);
  const repeatClass = hasRepeatingDays ? TASK_REPEAT_CLASS : ``;

  const isExpired = dueDate instanceof Date && dueDate < Date.now();
  const expiredClass = isExpired ? TASK_EXPIRED_CLASS : ``;

  const controlMarkup = createControlMarkup(task);
  const descriptionMarkup = createDescriptionMarkup(task);
  const dueDateMarkup = createDueDateMarkup(task);
  const tagsMarkup = createTagsMarkup(task);

  return `<article class="card card--${color} ${repeatClass} ${expiredClass}">
    <div class="card__form">
      <div class="card__inner">

        ${controlMarkup}

        <div class="card__color-bar">
          <svg class="card__color-bar-wave" width="100%" height="10">
            <use xlink:href="#wave"></use>
          </svg>
        </div>

        ${descriptionMarkup}

        <div class="card__settings">
          <div class="card__details">

            ${dueDateMarkup}

            ${tagsMarkup}

          </div>
        </div>
      </div>
    </div>
  </article>`;
};

export {createTaskMarkup};
