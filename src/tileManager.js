
const fs =  require('fs-extra');
const path = require('path');

const isDirectory = source => fs.lstatSync(source).isDirectory()
const getDirectories = source => fs.readdirSync(source).map(name => path.join(source, name)).filter(isDirectory)

const mainTileDirectory = path.resolve(__dirname, '../public/tiles');
const getTileDirectory = tileName => path.resolve(mainTileDirectory, tileName);

const getTileInformation = tileFolderPath => ({
    name: path.basename(tileFolderPath),
    url: `static/${path.relative(path.resolve(__dirname, '../public'),`${tileFolderPath}/index.html`)}`,
    overlay: `static/${path.relative(path.resolve(__dirname, '../public'),`${tileFolderPath}/overlay.html`)}`,
});

const getTiles  =  () => getDirectories(mainTileDirectory).map(getTileInformation);

const deleteTile = tileName => new Promise((resolve, reject) => {
  const directory = getTileDirectory(tileName);
  fs.remove(directory, err => {
    if (err){
      reject(err);
    }else{
      resolve();
    }
  });
});



module.exports = {
  getTiles,
  getTileDirectory,
  deleteTile,
};