
const extensionMap = {
  'js': 'javascript',
  'json': 'mqtt',
};
const getType = systemComponentPath => {
  const parts = systemComponentPath.split('.');
  const extension = parts[parts.length - 1];
  return extensionMap[extension] || 'executable';
};

module.exports = getType;