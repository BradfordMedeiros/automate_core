
const getTheme = () => new Promise((resolve, reject) => {
  console.log('get theme!');
  resolve();
});

const saveTheme = () => new Promise((resolve, reject) => {
  console.log('save theme!');
  resolve();
});

const deleteTheme = () => new Promise((resolve, reject) => {
  console.log('delete theme!');
  resolve();
});

module.exports = {
  getTheme,
  saveTheme,
  deleteTheme,
};