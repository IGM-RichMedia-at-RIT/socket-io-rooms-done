const controllers = require('./controllers');

const router = (app) => {
  app.get('/', controllers.index);
  app.get('/*', controllers.notFound);
};

module.exports = router;
