
const express = require('express');

const handleError = (err, res) => {
  res.status(500).jsonp({ error: 'interal server error' });
};

const create_routes = customTheme  => {
  if (customTheme === undefined){
    throw (new Error('custom_theme:create_routes customTheme not defined'));
  }

  const router = express();

  router.get('/', (req, res) => {
    customTheme.getTheme().then(theme => {
      res.send(theme);
    }).catch(err => {
      handleError(err, res);
    });
  });

  router.post('/', (req, res) => {
    const content = req.body.style;
    if (typeof(content) !== typeof("")){
      handleError('invalid parameters', res);
      return;
    }
    customTheme.saveTheme(content).then(() => {
      res.send('save ok');
    }).catch(err => {
      handleError(err, res);
    });
  });

  router.delete('/', (req, res) => {
    customTheme.deleteTheme().then(() => {
      res.send('delete ok');
    }).catch(err => {
      handleError(err, res);
    });
  });

  return router;
};

module.exports = create_routes;
