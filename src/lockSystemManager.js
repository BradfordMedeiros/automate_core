
let isLocked = false;

const lockSystem = () => new Promise((resolve, reject) => {
  isLocked = true;
  resolve();
});

const isSystemLocked = () => new Promise((resolve, reject) => {
  resolve(isLocked);
});

module.exports = {
  lockSystem,
  isSystemLocked,
};