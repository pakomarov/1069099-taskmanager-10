import {COLORS, MONTH_NAMES, WEEK_DAY_NAMES, ATTRIBUTE_CHECKED} from '../const.js';
import {createElement, formatTime, isDateExpired, joinMapped} from '../utils.js';

const ClassCard = {
  REPEAT: `card--repeat`,
  EXPIRED: `card--deadline`
};

const setupDueDateTemplate = (dueDateValue) => {
  return `<fieldset class="card__date-deadline">
    <label class="card__input-deadline-wrap">
      <input
        class="card__date"
        type="text"
        placeholder=""
        name="date"
        value="${dueDateValue}"
      />
    </label>
  </fieldset>`;
};

const createDueDateMarkup = ({dueDate, repeatingDays}) => {
  const hasRepeatingDays = Object.values(repeatingDays).some(Boolean);
  if (hasRepeatingDays) {
    return ``;
  }

  const hasDueDate = !!dueDate;
  const date = `${dueDate.getDate()} ${MONTH_NAMES[dueDate.getMonth()]}`;
  const time = formatTime(dueDate);
  const dueDateValue = hasDueDate ? `${date} ${time}` : ``;

  return setupDueDateTemplate(dueDateValue);
};

const setupRepeatingDayTemplate = (weekDayName, checkedAttribute) => {
  return `<input
    class="visually-hidden card__repeat-day-input"
    type="checkbox"
    id="repeat-${weekDayName}-4"
    name="repeat"
    value="${weekDayName}"
    ${checkedAttribute}
  />
  <label class="card__repeat-day" for="repeat-${weekDayName}-4"
    >${weekDayName}</label
  >`;
};

const createRepeatingDayMarkup = (weekDayName, isChecked) => {
  const checkedAttribute = isChecked ? ATTRIBUTE_CHECKED : ``;
  return setupRepeatingDayTemplate(weekDayName, checkedAttribute);
};

const setupRepeatingDaysTemplate = (repeatingDayListMarkup) => {
  return `<fieldset class="card__repeat-days">
    <div class="card__repeat-days-inner">
      ${repeatingDayListMarkup}
    </div>
  </fieldset>`;
};

const createRepeatingDaysMarkup = ({dueDate, repeatingDays}) => {
  if (!dueDate) {
    return ``;
  }

  const repeatingDayListMarkup = WEEK_DAY_NAMES.map((weekDayName) => {
    const isChecked = repeatingDays[weekDayName];
    return createRepeatingDayMarkup(weekDayName, isChecked);
  })
  .join(`\n`);

  return setupRepeatingDaysTemplate(repeatingDayListMarkup);
};

const setupTagTemplate = (tagValue, tagText) => {
  return `<span class="card__hashtag-inner">
    <input
      type="hidden"
      name="hashtag"
      value="${tagValue}"
      class="card__hashtag-hidden-input"
    />
    <p class="card__hashtag-name">
      #${tagText}
    </p>
    <button type="button" class="card__hashtag-delete">
      delete
    </button>
  </span>`;
};

const createTagMarkup = (initialText) => {
  // Убирает пробелы (https://stackoverflow.com/questions/5963182/how-to-remove-spaces-from-a-string-using-javascript)
  const editedText = initialText.replace(/\s+/g, ``);
  return setupTagTemplate(initialText, editedText);
};

const setupTagsTemplate = (tagListMarkup) => {
  return `<div class="card__hashtag-list">
    ${tagListMarkup}
  </div>`;
};

const createTagsMarkup = ({tags: setOfTags}) => {
  const tags = [...setOfTags];
  const tagListMarkup = joinMapped(tags, createTagMarkup, `\n`);
  return setupTagsTemplate(tagListMarkup);
};

const setupColorTemplate = (color, checkedAttribute) => {
  return `<input
    type="radio"
    id="color-${color}-4"
    class="card__color-input card__color-input--${color} visually-hidden"
    name="color"
    value="${color}"
    ${checkedAttribute}
  />
  <label
    for="color-${color}-4"
    class="card__color card__color--${color}"
    >${color}</label
  >`;
};

const createColorMarkup = (color, isChecked) => {
  const checkedAttribute = isChecked ? ATTRIBUTE_CHECKED : ``;
  return setupColorTemplate(color, checkedAttribute);
};

const setupColorsTemplate = (colorListMarkup) => {
  return `<div class="card__colors-inner">
    <h3 class="card__colors-title">Color</h3>
    <div class="card__colors-wrap">
      ${colorListMarkup}
    </div>
  </div>`;
};

const createColorsMarkup = ({color: currentColor}) => {
  const colorListMarkup = COLORS.map((color) => {
    const isChecked = color === currentColor;
    return createColorMarkup(color, isChecked);
  })
  .join(`\n`);

  return setupColorsTemplate(colorListMarkup);
};

const setupTaskEditTemplate = (Settings, EmbeddedMarkup) => {
  return `<article class="card card--edit card--${Settings.color} ${Settings.repeatClass} ${Settings.expiredClass}">
    <form class="card__form" method="get">
      <div class="card__inner">
        <div class="card__color-bar">
          <svg class="card__color-bar-wave" width="100%" height="10">
            <use xlink:href="#wave"></use>
          </svg>
        </div>

        <div class="card__textarea-wrap">
          <label>
            <textarea
              class="card__text"
              placeholder="Start typing your text here..."
              name="text"
            >${Settings.description}</textarea>
          </label>
        </div>

        <div class="card__settings">
          <div class="card__details">
            <div class="card__dates">
              <button class="card__date-deadline-toggle" type="button">
                date: <span class="card__date-status">${Settings.dueDateFlag}</span>
              </button>

              ${EmbeddedMarkup.dueDate}

              <button class="card__repeat-toggle" type="button">
                repeat:<span class="card__repeat-status">${Settings.repeatingDaysFlag}</span>
              </button>

              ${EmbeddedMarkup.repeatingDays}
            </div>

            <div class="card__hashtag">
              ${EmbeddedMarkup.tags}

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

          ${EmbeddedMarkup.colors}
        </div>

        <div class="card__status-btns">
          <button class="card__save" type="submit">save</button>
          <button class="card__delete" type="button">delete</button>
        </div>
      </div>
    </form>
  </article>`;
};

const createTaskEditTemplate = (task) => {
  const {
    color,
    repeatingDays,
    dueDate,
    description
  } = task;

  const TemplateSettings = {color, description};
  const EmbeddedMarkup = {};

  const hasRepeatingDays = Object.values(repeatingDays).some(Boolean);
  TemplateSettings.repeatClass = hasRepeatingDays ? ClassCard.REPEAT : ``;
  TemplateSettings.repeatingDaysFlag = hasRepeatingDays ? `yes` : `no`;

  TemplateSettings.expiredClass = isDateExpired(dueDate) ? ClassCard.EXPIRED : ``;

  const hasDueDate = !!dueDate;
  TemplateSettings.dueDateFlag = hasDueDate ? `yes` : `no`;

  EmbeddedMarkup.dueDate = createDueDateMarkup(task);
  EmbeddedMarkup.repeatingDays = createRepeatingDaysMarkup(task);
  EmbeddedMarkup.tags = createTagsMarkup(task);
  EmbeddedMarkup.colors = createColorsMarkup(task);

  return setupTaskEditTemplate(TemplateSettings, EmbeddedMarkup);
};

export default class TaskEdit {
  constructor(task) {
    this._task = task;
    this._element = null;
  }

  getTemplate() {
    return createTaskEditTemplate(this._task);
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }

    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}
