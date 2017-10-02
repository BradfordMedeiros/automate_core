
const express = require('express');

const create_routes = tileManager  => {
  if (tileManager === undefined){
    throw (new Error('tiles:create_routes tileManager not defined'));
  }

  const router = express();

  b = tileManager;
  router.get('/', (req, res) => {
    // get a listing of tilenames
    const tiles = tileManager.getTiles();
    res.status(200).jsonp(tiles);
  });

  /*router.post('/:tilename', (req, res) => {
    // save a tile
  });*/

  return router;
};

module.exports = create_routes;
