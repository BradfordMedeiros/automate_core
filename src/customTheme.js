
const fs = require('fs');
const path = require('path');

const defaultTheme = "";
const user_style_sheet_path = path.resolve('./public/user_style.css');

const getTheme = () => new Promise((resolve, reject) => {
  fs.readFile(user_style_sheet_path, (err, content) => {
    if (err){
      reject(err);
    }else{
      resolve(content);
    }
  });
});

const saveTheme = theme => new Promise((resolve, reject) => {
  if (typeof(theme) !== typeof("")){
    reject("invalid theme type as parameter");
    return;
  }
  fs.writeFile(user_style_sheet_path, theme, err => {
    if (err){
      reject(err);
    }else{
      resolve();
    }
  });
});

const deleteTheme = () => saveTheme(defaultTheme);

module.exports = {
  getTheme,
  saveTheme,
  deleteTheme,
};