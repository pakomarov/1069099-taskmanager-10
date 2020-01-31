import {createElement} from '../utils.js';

const createFilterMarkup = (filter, checkedAttribute) => {
  return `<input
      type="radio"
      id="filter__${filter.title}"
      class="filter__input visually-hidden"
      name="filter"
      ${checkedAttribute}
    />
    <label for="filter__all" class="filter__label">
      ${filter.title} <span class="filter__all-count">${filter.count}</span></label
  >`;
};

const setupFilterTemplate = (filterListMarkup) => {
  return `<section class="main__filter filter container">
    ${filterListMarkup}
  </section>`;
};

const createFilterTemplate = (filters) => {
  const filterListMarkup = filters.map((it, i) => {
    const checkedAttribute = i === 0 ? `checked` : ``;
    return createFilterMarkup(it, checkedAttribute);
  })
  .join(`\n`);
  return setupFilterTemplate(filterListMarkup);
};

export default class Filter {
  constructor(filters) {
    this._filters = filters;
    this._element = null;
  }

  getTemplate() {
    return createFilterTemplate(this._filters);
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
