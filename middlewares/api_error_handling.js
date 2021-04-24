  
const ApiError = require('../Errorhandler/APIerror');

function apiErrorHandler(err, req, res, next) {
  
  console.error(err);

  if (err instanceof ApiError) {
    res.status(err.code).send(err.message);
    return;
  }
  res.status(500).send('something went wrong');
}

module.exports = apiErrorHandler;