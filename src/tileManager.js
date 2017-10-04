
const fs =  require('fs-extra');
const path = require('path');

const isDirectory = source => fs.lstatSync(source).isDirectory()
const getDirectories = source => fs.readdirSync(source).map(name => path.join(source, name)).filter(isDirectory)

const mainTileDirectory = path.resolve(__dirname, '../public/tiles');
const getTileDirectory = tileName => path.resolve(mainTileDirectory, tileName);

const getTileInformation = tileFolderPath => ({
    name: path.basename(tileFolderPath),
    url: path.relative(path.resolve(__dirname, '../public'),`${tileFolderPath}/index.html`),
  }
);

const getTiles  =  () => getDirectories(mainTileDirectory).map(getTileInformation);

const addTile = () => {
  // check if the folder exists
  // then unzip the folder
  throw (new Error('not yet implemented'));
};

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
  addTile,
  deleteTile,
};