const createFilterMarkup = (filter) => {
  const {title, count} = filter;

  return `<input
      type="radio"
      id="filter__all"
      class="filter__input visually-hidden"
      name="filter"
      checked
    />
    <label for="filter__all" class="filter__label">
      ${title} <span class="filter__all-count">${count}</span></label
  >`;
};

const createFiltersMarkup = (filters) => {
  return `<section class="main__filter filter container">
    ${filters
      .map(createFilterMarkup)
      .join(`\n`)}
  </section>`;
};

export {createFiltersMarkup};
