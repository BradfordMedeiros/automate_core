
const extensionMap = {
  'js': 'javascript',
};
const getType = systemComponentPath => {
  const parts = systemComponentPath.split('.');
  const extension = parts[parts.length - 1];
  return extensionMap[extension] || 'mqtt';
};

module.exports = getType;