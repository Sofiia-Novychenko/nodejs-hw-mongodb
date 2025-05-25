const parseSortBy = (value) => {
  if (typeof value === 'undefined') {
    return '_id';
  }

  //* параметри за якими можна сортувати
  const keys = ['_id', 'name', 'createdAt'];

  //* перевірка на те чи правильний параметр обрав користувач
  if (keys.includes(value) !== true) {
    return '_id';
  }

  return value;
};

const parseSortOrder = (value) => {
  if (typeof value === 'undefined') {
    return 'asc';
  }

  if (value !== 'asc' && value !== 'desc') {
    return 'asc';
  }

  return value;
};

export const parsSortParams = (query) => {
  const { sortBy, sortOrder } = query;

  const parsedSortBy = parseSortBy(sortBy);
  const parsedsortOrder = parseSortOrder(sortOrder);

  return {
    sortBy: parsedSortBy,
    sortOrder: parsedsortOrder,
  };
};
