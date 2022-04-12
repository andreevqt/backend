'use strict';

const chalk = require('chalk');

const script = () => {
  const { extractValue, extractArray } = window.scrapper.table;

  const elName = document.querySelector('[class^="styles_primaryName"]');
  const name = elName && elName.textContent;

  const elOrigName = document.querySelector('[class^="styles_secondaryName"]');
  const originalName = elOrigName && elOrigName.textContent;

  const birthDate = extractArray('Дата рождения').join(' ') || null;
  const placeOfBirth = extractArray('Место рождения').join(', ') || null;

  const elPhoto = document.querySelector('[class^="styles_photoWrapper"] img');
  const photo = elPhoto && elPhoto.src;

  return {
    name,
    photo,
    originalName,
    birthDate,
    placeOfBirth
  };
};

let count = 0;
const run = async (manager) => {
  const knex = manager.getKnex();
  const queue = manager.getPersonQueue();
  const personPage = manager.getPersonPage();

  const upsert = async (person) => {
    return knex('persons').insert({ ...person, lastSync: knex.raw('now()') })
      .onConflict('id')
      .merge();
  };

  let link;
  while (link = await queue.dequeue()) {
    await manager.goto(personPage, link);
    const person = await personPage.evaluate(script);
    await upsert(person);
    count++;
    console.log(chalk.yellow(`Persons processed ${count}`));
  }
};

module.exports.run = run;
