'use strict';

const Commands = {
  EXTRACT_MOVIE: 'EXTRACT_MOVIE',
  EXTRACT_PERSON: 'EXTRACT_PERSON',
  EXTRACT_CREW: 'EXTRACT_CREW'
};

const extractor = (command) => {
  const $tableRows = Array.from(document.querySelectorAll('[class^="styles_row"]'));

  const filter = (text) => $tableRows.filter(
    ($item) => $item.querySelector('[class^="styles_title"]').textContent === text
  ).shift();

  const extractValue = (key, cb) => {
    const $row = filter(key);
    if (!$row) {
      return;
    }

    if (cb) {
      return cb($row);
    }

    const $cell = $row.querySelector('a, [class^="styles_valueDark"], [class^="styles_valueLight"]');
    return $cell && $cell.textContent;
  };

  const extractArray = (key) => {
    const $row = filter(key);
    return $row && Array.from($row.querySelectorAll('a:not(.keywords)')).map(($item) => $item.textContent);
  };

  const getId = (id = window.location.href) => {
    return +id.match(/\/(\d+)\/$/)[1];
  };

  const extractDate = (date) => {
    const map = {
      'января': '00',
      'февраля': '01',
      'марта': '02',
      'апреля': '03',
      'мая': '04',
      'июня': '05',
      'июля': '06',
      'августа': '07',
      'сентября': '08',
      'октября': '09',
      'ноября': '10',
      'декабря': '11'
    };

    const [, day, month, year] = date.match(/^(\d+)\s(.+)\s(\d+)$/);
    return `${year.padStart(4, 0)}-${map[month]}-${day.padStart(2, 0)} 00:00:00`;
  };

  switch (command) {
    case 'EXTRACT_MOVIE': {
      const id = getId();

      const title = Array.from(document.querySelectorAll('h1 span')).map((item) => item.textContent).join(' ');

      const $originalTitle = document.querySelector('[data-tid="eb6be89"]');
      const originalTitle = $originalTitle && $originalTitle.textContent;

      const $description = document.querySelector('div[class^="styles_filmSynopsis"] p');
      const description = $description && $description.textContent;

      const $poster = document.querySelector('.film-poster');
      const poster = $poster && !$poster.src.endsWith('placeholder.svg') && $poster.src;

      const type = window.location.href.match(/\/series\//) ? 'series' : 'movie';

      const year = +extractValue('Год производства');
      const slogan = extractValue('Слоган') || '-';
      const budget = extractValue('Бюджет');

      const feesWorld = extractValue('Сборы в мире', (row) => row.querySelector('a').textContent);
      const $feesUSA = extractValue('Сборы в США');
      const feesUSA = $feesUSA && $feesUSA.replace('сборы', '');
      const feesRussia = extractValue('Сборы в России');
      const age = extractValue('Возраст', (row) => row.querySelector('span').textContent);
      const $duration = extractValue('Время');
      const duration = $duration && +$duration.match(/^\d+/)[0];

      const $rating = document.querySelector('.film-rating-value');
      const rating = $rating && +$rating.textContent;

      const $votes = document.querySelector('[class^="styles_count"]');
      const votesMatch = $votes && $votes.textContent.match(/\d/g);
      const votes = votesMatch && +votesMatch.join('');

      const countries = extractArray('Страна');
      const genres = extractArray('Жанр');

      // top 250
      const $top250container = document.querySelector('[class^="styles_topListPositionBadge"]');
      const top250 = $top250container && +$top250container.querySelector('[class*="styles_position"]').textContent.match(/\d+/)[0];

      // release
      const $release = extractArray('Премьера в мире');
      const release = $release && extractDate($release[0]);

      const movie = {
        id,
        title,
        originalTitle,
        description,
        poster,
        type,
        year,
        rating,
        votes,
        feesWorld,
        feesRussia,
        feesUSA,
        age,
        duration,
        slogan,
        budget,
        release,
        top250
      };

      return {
        movie,
        countries,
        genres
      };
    }
    case 'EXTRACT_PERSON': {
      const id = getId();

      const $name = document.querySelector('[class^="styles_primaryName"]');
      const name = $name && $name.textContent;

      const $originalName = document.querySelector('[class^="styles_secondaryName"]');
      const originalName = $originalName && $originalName.textContent;

      const birthDate = extractArray('Дата рождения').join(' ') || null;
      const placeOfBirth = extractArray('Место рождения').join(', ') || null;

      const elPhoto = document.querySelector('[class^="styles_photoWrapper"] img');
      const photo = elPhoto && elPhoto.src;

      return {
        id,
        name,
        photo,
        originalName,
        birthDate,
        placeOfBirth
      };
    }
    case 'EXTRACT_CREW': {
      const $crewBlocks = document.querySelectorAll('.actorInfo');
      return Array.from($crewBlocks).map(($block) => {
        const $info = $block.querySelector('.info');
        const kinopoiskLink = $info.querySelector('a').href;
        const personId = getId(kinopoiskLink);
        const movieId = +window.location.href.match(/film\/(\d+)\//)[1];
        const $role = $info.querySelector('.role');
        const role = $role ? $role.textContent : null;
        const $name = $info.querySelector('.name a');
        const name = $name ? $name.textContent : null;
        const $originalName = $block.querySelector('.name span');
        const originalName = $originalName ? $originalName.textContent : null;

        const photo = `https://kinopoisk.ru/images/sm_actor/${personId}.jpg`;

        return {
          name,
          photo,
          originalName,
          personId,
          movieId,
          kinopoiskLink,
          role
        };
      });
    }
    default:
      return;
  }
};

module.exports = {
  extractor,
  Commands
};
