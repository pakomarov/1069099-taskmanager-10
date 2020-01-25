import {MONTH_NAMES} from '../const.js';
import {formatTime, isDateExpired, joinMapped} from '../utils.js';

const ClassCard = {
  DISABLE: `card__btn--disabled`,
  REPEAT: `card--repeat`,
  EXPIRED: `card--deadline`
};

const createControlMarkup = ({isArchive, isFavorite}) => {
  const archiveClass = isArchive ? ClassCard.DISABLE : ``;
  const favoriteClass = isFavorite ? ClassCard.DISABLE : ``;

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

const createDescriptionMarkup = ({description}) => {
  return `<div class="card__textarea-wrap">
    <p class="card__text">${description}</p>
  </div>`;
};

const createDueDateMarkup = ({dueDate}) => {
  if (!dueDate) {
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

const createTagsMarkup = ({tags: setOfTags}) => {
  const areTagsShowing = !!setOfTags.size;
  if (!areTagsShowing) {
    return ``;
  }

  const tags = [...setOfTags];
  const tagListMarkup = joinMapped(tags, createTagMarkup, `\n`);
  return `<div class="card__hashtag">
    <div class="card__hashtag-list">
      ${tagListMarkup}
    </div>
  </div>`;
};

const createTaskMarkup = (task) => {
  const {color, repeatingDays, dueDate} = task;

  const hasRepeatingDays = Object.values(repeatingDays).some(Boolean);
  const repeatClass = hasRepeatingDays ? ClassCard.REPEAT : ``;

  const expiredClass = isDateExpired(dueDate) ? ClassCard.EXPIRED : ``;

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
