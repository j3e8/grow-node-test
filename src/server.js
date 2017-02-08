let config = require('config');
let app = require('express')();

require('./routes/index.js')(app);

let port = config.get('port');
app.listen(port, function () {
  console.log('Example app listening on port', port)
})
