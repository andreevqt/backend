'use strict';

const script = () => {
  const extractItems = () => {
    return Array.from(document.querySelectorAll('.actorInfo .info')).map((el) => {
      const { getId } = window.scrapper.page;
      return getId(el.querySelector('a').href);
    });
  };

  const match = window.location.href.match(/film\/(\d+)/);
  const movieId = match[1];

  return {
    movieId,
    people: extractItems()
  };
};

const getLinks = async (page) => {
  return page.$$eval('.actorInfo .info a', (items) => items.map((el) => el.getAttribute('href')));
};

const run = async (manager) => {
  const crewPage = manager.getCrewPage();
  const personQueue = manager.getPersonQueue();
  const queue = manager.getCrewQueue();

  let link;
  while (link = await queue.dequeue()) {
    await manager.goto(crewPage, link);
    const personLinks = await getLinks(crewPage);
    await Promise.all(personLinks.map((
      async (link) => personQueue.enqueue(link))
    ));
    const crew = await crewPage.evaluate(script);
    // console.log(crew);
  }
  // const queue = manager.getPersonQueue();
  /* const links = await getLinks(crewPage);
  for (let i = 0; i < links.length; i++) {
    const link = links[i];
    await queue.enqueue(link);
  } */
};

module.exports.run = run;
