const path = require('path');
const fs = require('fs');

const is_identifier = (path_to_file, type) =>  fs.lstatSync(path_to_file).isFile();

module.exports = is_identifier;