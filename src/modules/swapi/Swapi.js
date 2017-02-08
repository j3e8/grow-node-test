let config = require('config');
let request = require('request');

let Swapi = {};

Swapi.getCharacterByName = function(name) {
  return new Promise(function(resolve, reject) {
    let url = config.get('swapi').host + `/api/people/?search=${name}`;
    request(url, function (error, response, body) {
      if (error) {
        return reject({ code: 500, message: error });
      }
      if (response && response.statusCode == 200) {
        return resolve(JSON.parse(body));
      }
      reject({ code: 500, message: "Unknown error retrieving character" })
    });
  });
}

Swapi.getCharacters = function(qty) {
  let characters = [];
  let url = config.get('swapi').host + `/api/people/`;
  return paginateCharacters(url, qty, characters);
}

function paginateCharacters(url, qty, characters) {
  if (characters.length > qty) {
    characters = characters.slice(0, qty);
  }
  if (characters.length == qty) {
    return Promise.resolve(characters);
  }

  return loadPageOfCharacters(url)
  .then((data) => {
    if (!data || !data.results) {
      return Promise.resolve(characters);
    }
    characters = characters.concat(data.results);
    return paginateCharacters(data.next, qty, characters);
  })
}

function loadPageOfCharacters(url) {
  return new Promise(function(resolve, reject) {
    request(url, function (error, response, body) {
      if (error) {
        return reject({ code: 500, message: error });
      }
      if (response && response.statusCode == 200) {
        let data = JSON.parse(body);
        return resolve(data);
      }
      reject({ code: 500, message: "Unknown error retrieving characters" })
    });
  });
}

Swapi.getPlanets = function() {
  let planets = [];
  let url = config.get('swapi').host + `/api/planets/`;
  return paginatePlanets(url, planets);
}

function paginatePlanets(url, planets) {
  return loadPageOfPlanets(url)
  .then((data) => {
    if (!data || !data.results) {
      return Promise.resolve(planets);
    }
    planets = planets.concat(data.results);
    if (data.next) {
      return paginatePlanets(data.next, planets);
    }
    return Promise.resolve(planets);
  })
}

function loadPageOfPlanets(url) {
  return new Promise(function(resolve, reject) {
    request(url, function (error, response, body) {
      if (error) {
        return reject({ code: 500, message: error });
      }
      if (response && response.statusCode == 200) {
        let data = JSON.parse(body);
        return resolve(data);
      }
      reject({ code: 500, message: "Unknown error retrieving planets" })
    });
  });
}


Swapi.getPlanetResidents = function(planet) {
  let residents = [];
  let iter = planet.residents.entries();
  return iterateResidents(iter, residents);
}

function iterateResidents(iter, residents) {
  let iteration = iter.next();
  if (iteration.done) {
    return Promise.resolve(residents);
  }
  let index = iteration.value[0];
  let residentUrl = iteration.value[1];
  return loadResident(residentUrl)
  .then((resident) => {
    residents.push(resident);
    return iterateResidents(iter, residents);
  })
}

function loadResident(residentUrl) {
  return new Promise(function(resolve, reject) {
    request(residentUrl, function (error, response, body) {
      if (error) {
        return reject({ code: 500, message: error });
      }
      if (response && response.statusCode == 200) {
        let data = JSON.parse(body);
        return resolve(data);
      }
      reject({ code: 500, message: "Unknown error retrieving resident" })
    });
  });
}

module.exports = Swapi;
