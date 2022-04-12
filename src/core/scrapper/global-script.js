const globalScript = () => {
  const tableRows = Array.from(document.querySelectorAll('[class^="styles_row"]'));
  const filter = (text) => tableRows.filter(
    (item) => item.querySelector('[class^="styles_title"]').textContent === text
  ).shift();

  const extractValue = (key, cb) => {
    const row = filter(key);
    if (!row) {
      return;
    }

    if (cb) {
      return cb(row);
    }

    const cell = row.querySelector('a, [class^="styles_valueDark"], [class^="styles_valueLight"]');
    return cell && cell.textContent;
  };

  const extractArray = (key) => {
    const row = filter(key);
    return row && Array.from(row.querySelectorAll('a:not(.keywords)')).map((item) => item.textContent);
  };

  const getId = (id = window.location.href) => {
    return +id.match(/\/(\d+)\/$/)[1];
  };

  const getTitle = () => {
    return Array.from(document.querySelectorAll('h1 span')).map((item) => item.textContent).join(' ');
  };

  const getOriginalTitle = () => {
    const originalTitleEl = document.querySelector('[data-tid="eb6be89"]');
    return originalTitleEl && originalTitleEl.textContent;
  };

  const getDescription = () => {
    const descriptionEl = document.querySelector('div[class^="styles_filmSynopsis"] p');
    return descriptionEl && descriptionEl.textContent;
  };

  const getPoster = () => {
    const posterEl = document.querySelector('.film-poster');
    return posterEl && posterEl.src;
  };

  const getType = () => {
    return document.querySelector('[class^="styles_brackets"]') ? 'series' : 'movie';
  };

  const scrapper = {
    page: {
      getId
    },
    table: {
      extractValue,
      extractArray
    },
    movie: {
      getTitle,
      getType,
      getOriginalTitle,
      getDescription,
      getPoster
    }
  };

  window.scrapper = window.scrapper || scrapper;
};

module.exports = globalScript;
