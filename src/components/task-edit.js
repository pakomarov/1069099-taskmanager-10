import {COLORS, MONTH_NAMES, WEEK_DAY_NAMES} from '../const.js';
import {formatTime, isDateExpired} from '../utils.js';

const TASK_REPEAT_CLASS = `card--repeat`;
const TASK_EXPIRED_CLASS = `card--deadline`;

const createDescriptionMarkup = ({description}) => {
  return `<div class="card__textarea-wrap">
    <label>
      <textarea
        class="card__text"
        placeholder="Start typing your text here..."
        name="text"
      >${description}</textarea>
    </label>
  </div>`;
};

const createDueDateMarkup = ({dueDate, repeatingDays}) => {
  const hasRepeatingDays = Object.values(repeatingDays).some(Boolean);
  if (hasRepeatingDays) {
    return ``;
  }

  const hasDueDate = !!dueDate;
  const date = `${dueDate.getDate()} ${MONTH_NAMES[dueDate.getMonth()]}`;
  const time = formatTime(dueDate);

  return `<fieldset class="card__date-deadline">
    <label class="card__input-deadline-wrap">
      <input
        class="card__date"
        type="text"
        placeholder=""
        name="date"
        value="${hasDueDate ? `${date} ${time}` : ``}"
      />
    </label>
  </fieldset>`;
};

const createRepeatingDayMarkup = (weekDayName, isChecked) => {
  return `<input
    class="visually-hidden card__repeat-day-input"
    type="checkbox"
    id="repeat-${weekDayName}-4"
    name="repeat"
    value="${weekDayName}"
    ${isChecked ? `checked` : ``}
  />
  <label class="card__repeat-day" for="repeat-${weekDayName}-4"
    >${weekDayName}</label
  >`;
};

const createRepeatingDaysMarkup = ({dueDate, repeatingDays}) => {
  const hasDueDate = !!dueDate;
  if (hasDueDate) {
    return ``;
  }

  return `<fieldset class="card__repeat-days">
    <div class="card__repeat-days-inner">
      ${WEEK_DAY_NAMES.map((weekDayName) => {
    const isChecked = repeatingDays[weekDayName];
    return createRepeatingDayMarkup(weekDayName, isChecked);
  })
  .join(`\n`)}
    </div>
  </fieldset>`;
};

const createTagMarkup = (initialText) => {
  // Убирает пробелы (https://stackoverflow.com/questions/5963182/how-to-remove-spaces-from-a-string-using-javascript)
  const editedText = initialText.replace(/\s+/g, ``);

  return `<span class="card__hashtag-inner">
    <input
      type="hidden"
      name="hashtag"
      value="${initialText}"
      class="card__hashtag-hidden-input"
    />
    <p class="card__hashtag-name">
      #${editedText}
    </p>
    <button type="button" class="card__hashtag-delete">
      delete
    </button>
  </span>`;
};

const createTagsMarkup = ({tags: setOfTags}) => {
  const arrayOfTags = [...setOfTags];
  return `<div class="card__hashtag-list">
    ${arrayOfTags
      .map(createTagMarkup)
      .join(`\n`)}
  </div>`;
};

const createColorMarkup = (color, isChecked) => {
  return `<input
    type="radio"
    id="color-${color}-4"
    class="card__color-input card__color-input--${color} visually-hidden"
    name="color"
    value="${color}"
    ${isChecked ? `checked` : ``}
  />
  <label
    for="color-${color}-4"
    class="card__color card__color--${color}"
    >${color}</label
  >`;
};

const createColorsMarkup = ({color: currentColor}) => {
  return `<div class="card__colors-inner">
    <h3 class="card__colors-title">Color</h3>
    <div class="card__colors-wrap">
      ${COLORS.map((color) => {
    const isChecked = color === currentColor;
    return createColorMarkup(color, isChecked);
  })
    .join(`\n`)}
    </div>
  </div>`;
};

const createTaskEditMarkup = (task) => {
  const {color, dueDate, repeatingDays} = task;

  const hasRepeatingDays = Object.values(repeatingDays).some(Boolean);
  const repeatClass = hasRepeatingDays ? TASK_REPEAT_CLASS : ``;

  const expiredClass = isDateExpired(dueDate) ? TASK_EXPIRED_CLASS : ``;

  const hasDueDate = !!dueDate;

  const descriptionMarkup = createDescriptionMarkup(task);
  const dueDateMarkup = createDueDateMarkup(task);
  const repeatingDaysMarkup = createRepeatingDaysMarkup(task);
  const tagsMarkup = createTagsMarkup(task);
  const colorsMarkup = createColorsMarkup(task);

  return `<article class="card card--edit card--${color} ${repeatClass} ${expiredClass}">
    <form class="card__form" method="get">
      <div class="card__inner">
        <div class="card__color-bar">
          <svg class="card__color-bar-wave" width="100%" height="10">
            <use xlink:href="#wave"></use>
          </svg>
        </div>

        ${descriptionMarkup}

        <div class="card__settings">
          <div class="card__details">
            <div class="card__dates">
              <button class="card__date-deadline-toggle" type="button">
                date: <span class="card__date-status">${hasDueDate ? `yes` : `no`}</span>
              </button>

              ${dueDateMarkup}

              <button class="card__repeat-toggle" type="button">
                repeat:<span class="card__repeat-status">${hasRepeatingDays ? `yes` : `no`}</span>
              </button>

              ${repeatingDaysMarkup}
            </div>

            <div class="card__hashtag">
              ${tagsMarkup}

              <label>
                <input
                  type="text"
                  class="card__hashtag-input"
                  name="hashtag-input"
                  placeholder="Type new hashtag here"
                />
              </label>
            </div>
          </div>

          ${colorsMarkup}
        </div>

        <div class="card__status-btns">
          <button class="card__save" type="submit">save</button>
          <button class="card__delete" type="button">delete</button>
        </div>
      </div>
    </form>
  </article>`;
};

export {createTaskEditMarkup};
