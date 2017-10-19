
let isLocked = false;
let systemName = undefined;

const lockSystem = sysName => new Promise((resolve, reject) => {
  isLocked = true;
  systemName = sysName;
  resolve();
});

const getSystemLockedData = () => new Promise((resolve, reject) => {
  resolve({
    isLocked,
    systemName,
  });
});

module.exports = {
  lockSystem,
  getSystemLockedData,
};