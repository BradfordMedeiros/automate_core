
const fs =  require('fs');
const path = require('path');

const isDirectory = source => fs.lstatSync(source).isDirectory()
const getDirectories = source => fs.readdirSync(source).map(name => path.join(source, name)).filter(isDirectory)
const tileDirectory = path.resolve('../public/tiles');

const getTileName = x => path.basename(x);
const getwebPath = x => path.relative(path.resolve('..'));

const getTiles  =  () => {
  // equivalent to just getting the list of directory
  // {
  //    url: x/index.html
  //    name: (just the folder name)
  // }
  //throw (new Error('not yet implemented'));
  return getDirectories(tileDirectory);
};

const addTile = () => {
  // check if the folder exists
  // then unzip the folder
  throw (new Error('not yet implemented'));
};

const deleteTile = () => {
  // delete the folder
  throw (new Error('not yet implemented'));
};

module.exports = {
  getTiles,
  addTile,
  deleteTile,
  getDirectories,
};