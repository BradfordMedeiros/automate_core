
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
        const tileIndexHtml = `${newpath}/index.html`;
        const tileOverlayHtml = `${newpath}/overlay.html`;

        targz.decompress({
          src: oldpath,
          dest: newpath,
        }, err => {
          if (err){
            console.log('error decompressing file');
            res.status(400).jsonp({ error: 'internal server error' });
          }else{

            const injectScripts = Promise.all([
              tileManager.injectAllScripts(tileIndexHtml, '127.0.0.1'),
              tileManager.injectAllScripts(tileOverlayHtml, '127.0.0.1'),
            ]);
            console.log('--tileIndexIndex: ', tileIndexHtml);
            console.log('tile overlay: ', tileIndexHtml);
            injectScripts.then(() => {
              res.send('ok');
            }).catch(() => {
              tileManager.deleteTile(tileName).then(() => {
                res.status(400).jsonp({ error: 'upload tile failure, deleted successfully' });
              }).catch(() => {
                res.status(400).jsonp({ error: 'upload tile failure, deleted unsuccessfully' });
              });
            });
          }
        });
      }
    });
  });

  router.get('/:tilename', (req, res) => {

    console.warn('@todo make sure we are removing injected scripts all download');
    console.warn('@todo looks like we are not removing them...?');

    console.log('downloading file');
    const tileName =  req.params.tilename;
    const tileDirectory = tileManager.getTileDirectory(tileName);
    const tmpDirectory = path.resolve('./tmp/test.tar.gz'); // this is a race condition with the upload

    targz.compress({
      src: tileDirectory,
      dest: tmpDirectory,
    }, (err) => {
      if (err){
        console.log('error compressing file');
        res.status(400).jsonp({ error: 'internal server error' });
      }else{
        console.log('sending file ', tmpDirectory);
        res.sendFile(tmpDirectory);
      }
    });

  });

  router.delete('/:tilename', (req, res) => {
    const tileName =  req.params.tilename;
    tileManager.deleteTile(tileName).then(() => {
      res.status(200).send('ok');
    }).catch(() => {
      res.status(400).jsonp({ error: 'internal server error' });
    });

  });

  return router;
};

module.exports = create_routes;
