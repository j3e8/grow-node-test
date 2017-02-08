let Swapi = require('../modules/swapi/Swapi.js');
let ejs = require('ejs');

let Character = {};

Character.getCharacterByName = function(name) {
  if (!name) {
    return Promise.reject({ code: 400, message: "No name provided" })
  }
  return Swapi.getCharacterByName(name)
  .then((characters) => {
    let html = [];
    characters.results.forEach((c) => {
      console.log(c.name);
      let h = ejs.render(`
        <div>
          <h1><%= person.name %></h1>
          <div>Gender: <%= person.gender %></div>
          <div>Height: <%= person.height %></div>
          <div>Mass: <%= person.mass %></div>
        </div>
      `, { person: c });
      html.push(h);
    });
    return Promise.resolve(html.join('\n'));
  });
}


Character.getCharacters = function(sort) {
  return Swapi.getCharacters(50)
  .then((characters) => {
    characters.sort((a, b) => {
      return sortByProperty(a, b, sort);
    });
    return Promise.resolve(characters);
  })
}

function sortByProperty(a, b, prop) {
  if (a[prop] == b[prop]) {
    return 0;
  }

  let value_a = a[prop], value_b = b[prop];
  let digit_r = /[^0-9\.]/g;
  if (prop == 'height' || prop == 'mass') {
    let a = value_a.replace(digit_r, '');
    value_a = a ? parseFloat(a) : undefined;
    let b = value_b.replace(digit_r, '');
    value_b = b ? parseFloat(b) : undefined;
  }

  if (value_a === undefined && value_b !== undefined) {
    return -1;
  }
  else if (value_a !== undefined && value_b === undefined) {
    return 1;
  }
  return value_a < value_b ? -1 : 1;
}


Character.getCharactersByPlanet = function() {
  return Swapi.getPlanets()
  .then((planets) => {
    let iter = planets.entries();
    let planetResidents = {};
    return iteratePlanets(iter, planetResidents);
  })
}

function iteratePlanets(iter, planetResidents) {
  let iteration = iter.next();
  if (iteration.done) {
    return Promise.resolve(planetResidents);
  }
  let index = iteration.value[0];
  let planet = iteration.value[1];
  return Swapi.getPlanetResidents(planet)
  .then((residents) => {
    planetResidents[planet.name] = residents.map((r) => r.name);
    return iteratePlanets(iter, planetResidents);
  })
}

module.exports = Character;
