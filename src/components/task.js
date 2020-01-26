import {MONTH_NAMES} from '../const.js';
import {formatTime, isDateExpired, joinMapped, removeSpaces} from '../utils.js';

const ClassCard = {
  DISABLE: `card__btn--disabled`,
  REPEAT: `card--repeat`,
  EXPIRED: `card--deadline`
};

const setupDueDateTemplate = (date, time) => {
  return `<div class="card__dates">
    <div class="card__date-deadline">
      <p class="card__input-deadline-wrap">
        <span class="card__date">${date}</span>
        <span class="card__time">${time}</span>
      </p>
    </div>
  </div>`;
};

const createDueDateMarkup = ({dueDate}) => {
  if (!dueDate) {
    return ``;
  }

  const date = `${dueDate.getDate()} ${MONTH_NAMES[dueDate.getMonth()]}`;
  const time = formatTime(dueDate);

  return setupDueDateTemplate(date, time);
};

const setupTagTemplate = (tagText) => {
  return `<span class="card__hashtag-inner">
    <span class="card__hashtag-name">
      #${tagText}
    </span>
  </span>`;
};

const createTagMarkup = (initialText) => {
  // Убирает пробелы (https://stackoverflow.com/questions/5963182/how-to-remove-spaces-from-a-string-using-javascript)
  const editedText = removeSpaces(initialText);

  return setupTagTemplate(editedText);
};

const setupTagsTemplate = (tagListMarkup) => {
  return `<div class="card__hashtag">
    <div class="card__hashtag-list">
      ${tagListMarkup}
    </div>
  </div>`;
};

const createTagsMarkup = ({tags: setOfTags}) => {
  const areTagsShowing = !!setOfTags.size;
  if (!areTagsShowing) {
    return ``;
  }

  const tags = [...setOfTags];
  const tagListMarkup = joinMapped(tags, createTagMarkup, `\n`);

  return setupTagsTemplate(tagListMarkup);
};

const setupTaskTemplate = (Settings, EmbeddedMarkup) => {
  return `<article class="card card--${Settings.color} ${Settings.repeatClass} ${Settings.expiredClass}">
    <div class="card__form">
      <div class="card__inner">
        <div class="card__control">
          <button type="button" class="card__btn card__btn--edit">
            edit
          </button>
          <button
            type="button"
            class="card__btn card__btn--archive ${Settings.archiveClass}"
          >
            archive
          </button>
          <button
            type="button"
            class="card__btn card__btn--favorites ${Settings.favoriteClass}"
          >
            favorites
          </button>
        </div>
        <div class="card__color-bar">
          <svg class="card__color-bar-wave" width="100%" height="10">
            <use xlink:href="#wave"></use>
          </svg>
        </div>
        <div class="card__textarea-wrap">
          <p class="card__text">${Settings.description}</p>
        </div>
        <div class="card__settings">
          <div class="card__details">
            ${EmbeddedMarkup.dueDateMarkup}
            ${EmbeddedMarkup.tagsMarkup}
          </div>
        </div>
      </div>
    </div>
  </article>`;
};

const createTaskMarkup = (task) => {
  const {
    color,
    repeatingDays,
    dueDate,
    isArchive,
    isFavorite,
    description
  } = task;

  const TemplateSettings = {color, description};
  const EmbeddedMarkup = {};

  const hasRepeatingDays = Object.values(repeatingDays).some(Boolean);
  TemplateSettings.repeatClass = hasRepeatingDays ? ClassCard.REPEAT : ``;
  TemplateSettings.expiredClass = isDateExpired(dueDate) ? ClassCard.EXPIRED : ``;
  TemplateSettings.archiveClass = isArchive ? ClassCard.DISABLE : ``;
  TemplateSettings.favoriteClass = isFavorite ? ClassCard.DISABLE : ``;

  EmbeddedMarkup.dueDateMarkup = createDueDateMarkup(task);
  EmbeddedMarkup.tagsMarkup = createTagsMarkup(task);

  return setupTaskTemplate(TemplateSettings, EmbeddedMarkup);
};

export {createTaskMarkup};
