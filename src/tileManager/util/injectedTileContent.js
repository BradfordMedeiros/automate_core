

const injectedCode  = `
    window.automate = {
        mqtt_url: 'ws://127.0.0.1:4000',
        ip_address: '127.0.0.1',
    };

`;

module.exports = injectedCode;
