import {joinMapped} from '../utils.js';

const createFilterMarkup = (filter) => {
  return `<input
      type="radio"
      id="filter__all"
      class="filter__input visually-hidden"
      name="filter"
      checked
    />
    <label for="filter__all" class="filter__label">
      ${filter.title} <span class="filter__all-count">${filter.count}</span></label
  >`;
};

const setupFiltersTemplate = (filterListMarkup) => {
  return `<section class="main__filter filter container">
    ${filterListMarkup}
  </section>`;
};

const createFiltersMarkup = (filters) => {
  const filterListMarkup = joinMapped(filters, createFilterMarkup, `\n`);
  return setupFiltersTemplate(filterListMarkup);
};

export {createFiltersMarkup};
