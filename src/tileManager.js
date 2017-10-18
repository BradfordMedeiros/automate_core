
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


const scripts = {
  common:  `<!--automate:inject--><script src="../common.js"></script><!--automate:inject-->\n`,
  env: `<!--automate:inject--><script src="../env.js"></script><!--automate:inject-->\n`,
};

const injectScript =  (filePath, scriptName) => new Promise((resolve, reject) => {
  const scriptContent = scripts[scriptName];
  if (scriptContent === undefined) {
    reject(`script: ${scriptName} is not defined`);
  }
  fs.readFile(filePath, (err, fileBuffer) =>  {
    if (err){
      reject(err);
    }else{
      const scriptInjectBuffer =  new Buffer(scriptContent);
      const newFile = Buffer.concat([scriptInjectBuffer, fileBuffer]).toString();
      fs.writeFile(filePath, newFile, err =>  {
        if (err){
          reject(err);
        }else{
          resolve();
        }
      });
      resolve();
    }
  });
});

const removeScript =  (filePath, scriptName) =>  new Promise((resolve, reject) => {
  const scriptContent = scripts[scriptName];
  if (scriptContent === undefined) {
    reject(`script: ${scriptName} is not defined`);
  }
  fs.readFile(filePath, (err, fileBuffer) =>  {
    if (err){
      reject(err);
    }else {
      const fileString = fileBuffer;

      const index = fileBuffer.indexOf(scriptContent);
      const lowBuffer = fileString.slice(0, index);
      const highBuffer = fileString.slice(index + scriptContent.length);

      if (index >= 0) {
        const newBuffer = Buffer.concat([lowBuffer, highBuffer]).toString();
        fs.writeFile(filePath, newBuffer, err => {
          if (err) {
            reject(err);
          } else {
            resolve();
          }
        });
      } else {
        reject('file does not contain injected script');
      }
      resolve();
    }
  });
});

module.exports = {
  getTiles,
  getTileDirectory,
  deleteTile,
  injectScript,
  removeScript,
};