module.exports = function(res, err) {
  let code = 500;
  let message = "Unknown error";

  if (typeof(err) == 'object' && err.code && parseInt(err.code)) {
    code = parseInt(err.code);
  }
  if (typeof(err) == 'object' && err.message) {
    message = err.message;
  }
  else if (typeof(err) == 'string') {
    message = err;
  }

  res.status(code).send(message);
}
