'use strict';

const crypto = require('../core/crypto');
const { shuffle, randomInt } = require('../utils');

const movies = [{
  "adult": false,
  "backdrop_path": "/iQFcwSGbZXMkeyKrxbPnwnRo5fl.jpg",
  "genres": [
    { "id": 28, name: "боевик" },
    { "id": 12, name: "приключения" },
    { "id": 878, name: "фантастика" }
  ],
  "id": 634649,
  "original_language": "en",
  "original_title": "Spider-Man: No Way Home",
  "overview": "Действие фильма «Человек-паук: Нет пути домой» начинает своё развитие в тот момент, когда Мистерио удаётся выяснить истинную личность Человека-паука. С этого момента жизнь Питера Паркера становится невыносимой. Если ранее он мог успешно переключаться между своими амплуа, то сейчас это сделать невозможно. Переворачивается с ног на голову не только жизнь Человека-пауку, но и репутация. Понимая, что так жить невозможно, главный герой фильма «Человек-паук: Нет пути домой» принимает решение обратиться за помощью к своему давнему знакомому Стивену Стрэнджу. Питер Паркер надеется, что с помощью магии он сможет восстановить его анонимность. Стрэндж соглашается помочь.",
  "popularity": 16007.82,
  "poster_path": "/zpH4yEqOJOReykVcSQYA1A258SQ.jpg",
  "release_date": "2021-12-15",
  "title": "Человек-паук: Нет пути домой",
  "video": false,
  "vote_average": 8.4,
  "vote_count": 6941
},
{
  "adult": false,
  "backdrop_path": "/k2twTjSddgLc1oFFHVibfxp2kQV.jpg",
  "genres": [
    { "id": 28, name: "боевик" },
    { "id": 12, name: "приключения" },
    { "id": 14, name: "фэнтези" },
    { "id": 878, name: "фантастика" }
  ],
  "id": 524434,
  "original_language": "en",
  "original_title": "Eternals",
  "overview": "Много тысячелетий назад с планеты Олимпия на Землю была отправлена группа сверхлюдей, обладающих суперспособностями, — Вечные. С доисторических времён они защищали человечество от нападений ужасных чудовищ девиантов, но любое другое вмешательство в развитие цивилизации им было запрещено. Начало XXI века. Уже несколько столетий прошло с тех пор, как был уничтожен последний девиант, когда после странного землетрясения внезапно объявляется новый монстр. Теперь живущим в разных уголках планеты Вечным снова придётся сплотить силы, чтобы противостоять новой угрозе.",
  "popularity": 4700.068,
  "poster_path": "/iCQTxIgEpNYvPfHvEuZkDcmWItU.jpg",
  "release_date": "2021-11-03",
  "title": "Вечные",
  "video": false,
  "vote_average": 7.2,
  "vote_count": 3935
},
{
  "adult": false,
  "backdrop_path": "/3G1Q5xF40HkUBJXxt2DQgQzKTp5.jpg",
  "genres": [
    { "id": 16, "name": "мультфильм" },
    { "id": 35, "name": "комедия" },
    { "id": 10751, "name": "семейный" },
    { "id": 14, "name": "фэнтези" }
  ],
  "id": 568124,
  "original_language": "en",
  "original_title": "Encanto",
  "overview": "Удивительная семья Мадригалов живет в спрятанном в горах Колумбии волшебном доме, расположенном в чудесном и очаровательном уголке под названием Энканто. Каждого ребёнка в семье Мадригалов магия этого места благословила уникальным даром — от суперсилы до способности исцелять. Увы, магия обошла стороной одну лишь юную Мирабель. Обнаружив, что магия Энканто находится в опасности, Мирабель решает, что именно она может быть последней надеждой на спасение своей особенной семьи.",
  "popularity": 3684.767,
  "poster_path": "/yAw00ke7CzSLe4mMuCGkAzma69K.jpg",
  "release_date": "2021-11-24",
  "title": "Энканто",
  "video": false,
  "vote_average": 7.8,
  "vote_count": 3852
}];

const genres = [
  { id: 28, name: "боевик" },
  { id: 12, name: "приключения" },
  { id: 16, name: "мультфильм" },
  { id: 35, name: "комедия" },
  { id: 80, name: "криминал" },
  { id: 99, name: "документальный" },
  { id: 18, name: "драма" },
  { id: 10751, name: "семейный" },
  { id: 14, name: "фэнтези" },
  { id: 36, name: "история" },
  { id: 27, name: "ужасы" },
  { id: 10402, name: "музыка" },
  { id: 9648, name: "детектив" },
  { id: 10749, name: "мелодрама" },
  { id: 878, name: "фантастика" },
  { id: 10770, name: "телевизионный фильм" },
  { id: 53, name: "триллер" },
  { id: 10752, name: "военный" },
  { id: 37, name: "вестерн" }
];


const titles = [
  'Как я попробовал фильм, и к чему привел этот необдуманный шаг',
  '17 дешевых и веселых идей для фильма',
  'Почему фильм не оставит вас равнодушным',
  'Как избавиться от проблема с фильмом раз и навсегда',
  'Как избавиться от проблема с фильмом раз и навсегда',
  'Управляй желаниями! Почему фильм способен привлечь к вам клиентов и партнеров',
  'Думайте что угодно о фильме, но на самом деле правда такова'
];

const contents = [
  'Вы услышите сейчас все подробности из первых уст: что было, к чему привело, какие проблемы решились, достигнуты ли результаты. Настоящая интрига: так что же с ним стало? История от первого лица непременно заинтересуют читателей.',
  'Вовлекайте читателей в диалог с первых слов. Главный герой фильма «Трасса 60». Не смотрели? Лишний повод узнать, кто он. Уже в курсе? Так что бы он сказал по теме статьи?',
  '53 новых и горячих советов о фильме.',
];

const movieIds = movies.map((movie) => movie.id);

const users = [{
  name: 'John Doe',
  _password: crypto.hash('123456'),
  email: 'example@mail.com'
}, {
  name: 'Jane Ho',
  _password: crypto.hash('123456'),
  email: 'jane@mail.com'
}];

module.exports.seed = async (knex) => {
  const { count } = knex.userParams;

  await knex('settings').truncate();
  await knex('users').truncate();
  await knex('genres').truncate();
  await knex('reviews').truncate();
  await knex('comments').truncate();

  await knex('settings').insert({
    key: 'featured_movies',
    value: JSON.stringify(movies)
  });
  await knex('genres').insert(genres);
  await knex('users').insert(users);

  const userIds = (await knex.select('id').from('users')).map((data) => data.id);
  const reviews = [...Array(count).keys()].map(() => {
    const movieId = shuffle(movieIds)[randomInt(0, movieIds.length - 1)];
    const movie = movies.find(({ id }) => id === movieId);
    return ({
      title: shuffle(titles)[randomInt(0, titles.length - 1)],
      content: shuffle(contents).join(' '),
      movieId: shuffle(movieIds)[randomInt(0, movieIds.length - 1)],
      movie,
      authorId: shuffle(userIds)[randomInt(0, userIds.length - 1)],
      rating: randomInt(0, 10)
    });
  });

  await knex('reviews').insert(reviews);
  const reviewIds = (await knex.select('id').from('reviews')).map(({ id }) => id);
  await Promise.all(reviewIds.map((id) => knex('comments').insert({
    content: shuffle(contents)[randomInt(0, contents.length - 1)],
    commentableType: 'Review',
    commentableId: id,
    authorId: shuffle(userIds)[randomInt(0, userIds.length - 1)]
  }))).catch((err) => console.log(err));
};
