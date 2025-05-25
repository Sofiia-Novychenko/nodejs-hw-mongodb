export const parsFiltersParams = (query) => {
  const { type, isFavourite } = query;
  const filters = {};

  if (['work', 'home', 'personal'].includes(type)) {
    filters.type = type;
  }

  if (['true', 'false'].includes(isFavourite)) {
    //* йде порівння значення заданого isFavourite з рядком 'true'
    //* 'true' === 'true' => true як буль
    //* 'false' === 'true' => false як буль
    filters.isFavourite = isFavourite === 'true';
  }

  return filters;
};
