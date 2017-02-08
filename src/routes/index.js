let Character = require('../api/Character.js');
let ErrorHandler = require('../modules/ErrorHandler.js');

module.exports = function(app) {

  app.get('/', function (req, res) {
    res.send('Looks like the server is running folks')
  })

  app.get('/character/:name', function(req, res) {
    Character.getCharacterByName(req.params.name)
    .then((result) => res.send(result))
    .catch((err) => ErrorHandler(res, err))
  })

  app.get('/characters', function(req, res) {
    Character.getCharacters(req.query.sort)
    .then((result) => res.json(result))
    .catch((err) => ErrorHandler(res, err));
  })

  app.get('/planetresidents', function(req, res) {
    Character.getCharactersByPlanet()
    .then((result) => res.json(result))
    .catch((err) => ErrorHandler(res, err));
  })

}
