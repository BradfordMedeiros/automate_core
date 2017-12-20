
let theTheme = "";
const getTheme = () => new Promise((resolve, reject) => {
  console.log('get theme!');
  resolve(theTheme);
});

const saveTheme = theme => new Promise((resolve, reject) => {
  console.log('save theme!');
  if (typeof(theme) !== typeof("")){
    reject("invalid theme type as parameter");
    return;
  }
  theTheme = theme;
  resolve();
});

const deleteTheme = () => new Promise((resolve, reject) => {
  console.log('delete theme!');
  theTheme = "";
  resolve();
});

module.exports = {
  getTheme,
  saveTheme,
  deleteTheme,
};