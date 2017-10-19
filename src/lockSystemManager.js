
let isSystemLocked = false;
const lockSystem = () => new Promise((resolve, reject) => {
  isSystemLocked = true;
  resolve();
});

const isSystemLocked = new Promise((resolve, reject) => {
  resolve(isSystemLocked);
});

module.exports = {
  lockSystem,
  isSystemLocked,
};