
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
    customTheme.getTheme().then(() => {
      res.send('get ok');
    }).catch(err => {
      handleError(err, res);
    });
  });

  router.post('/', (req, res) => {
    customTheme.saveTheme().then(() => {
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
