
const express = require('express');

const create_routes = ()  => {
  const router = express();

  router.get('/:tiles', (req, res) => {
    // get a listing of tilenames
  });

  router.post('/:tilename', (req, res) => {
    // save a tile
  });

  return router;
};

module.exports = create_routes;
