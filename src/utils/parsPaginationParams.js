const parseNumber = (value, defaulValue) => {
  //* перевірки чи нам щось взагалі прийшло
  if (typeof value === 'undefined') {
    return defaulValue;
  }
  const parsedValue = parseInt(value);

  //* переевірка а чи не NaN це
  if (Number.isNaN(parsedValue)) {
    return defaulValue;
  }

  return parsedValue;
};

export const parsPaginationParams = (query) => {
  const { page, perPage } = query;

  const parsedPage = parseNumber(page, 1);
  const parsedPerPage = parseNumber(perPage, 8);

  return {
    page: parsedPage,
    perPage: parsedPerPage,
  };
};
