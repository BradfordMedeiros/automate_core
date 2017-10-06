
const express = require('express');
const path = require('path');
const formidable = require('formidable');
const fs = require('fs');
const targz = require('targz');

const create_routes = tileManager  => {
  if (tileManager === undefined){
    throw (new Error('tiles:create_routes tileManager not defined'));
  }

  const router = express();

  router.get('/', (req, res) => {
    // get a listing of tilenames
    const tiles = tileManager.getTiles();
    res.status(200).jsonp(tiles);
  });

  router.post('/:tilename', (req, res) => {
    const tileName = req.params.tilename;
    const form = new formidable.IncomingForm();

    form.uploadDir = path.resolve(`./tmp`);

    form.parse(req, (err, fields, files) => {
      if (err){
        res.status(400).jsonp({ error: 'internal server error' });
      }else{
        const fileName = Object.keys(files)[0];
        const oldpath = files[fileName].path;
        const newpath = path.resolve(`./public/tiles/${tileName}`);

        targz.decompress({
          src: oldpath,
          dest: newpath,
        }, err => {
          if (err){
            console.log('error decompressing file');
            res.status(400).jsonp({ error: 'internal server error' });
          }else{
            res.send('ok');
          }
        });
      }
    });
  });

  return router;
};

module.exports = create_routes;
