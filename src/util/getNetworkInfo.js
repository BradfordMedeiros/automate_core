const network = require('network');

const getActiveInterface = () => new Promise((resolve, reject) => {
  network.get_active_interface((err, result) => {
    if (err){
      reject(err);
    }
    resolve(result);
  });
});

// Since this isn't instant operation, I cache the result
// assuming the ip address is constant while server is up
let publicIpResult = undefined;
const getPublicIp = () => new Promise((resolve, reject) => {
  if (publicIpResult !== undefined){
    resolve(publicIpResult);
  }
  network.get_public_ip((err, result) => {
    if (err){
      reject(err);
    }
    publicIpResult = result;
    resolve(result);
  });
});
getPublicIp(); // call once so it gets cached on initial call

const getNetworkInfo = timeout => new Promise((resolve, reject) => {
  const timeoutHandle = setTimeout(() => {
    reject("Network info timeout");
  }, timeout);
  const networkPromise = Promise.all([getActiveInterface(), getPublicIp()]);
  networkPromise.then(result => {
    clearTimeout(timeoutHandle);
    const info = {
      name: result[0].name,
      private_ip_address: result[0].ip_address,
      public_ip_address: result[1],
      mac_address: result[0].mac_address,
      gateway_ip: result[0].gateway_ip,
      netmask: result[0].netmask,
      type: result[0].type,
    };
    resolve(info);
  }).catch(reject);
  return networkPromise;
});

module.exports = getNetworkInfo;

