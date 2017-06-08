const fs = require('fs');
const path = require('path');
const sendmail = require('sendmail')({silent: true});

const template =  fs.readFileSync(path.join(__dirname, 'html/template.thtml')).toString();


const processTemplate = (template, {event_name, event_message} ) => {
  /*
   {event_name}
   {event_template}
   */
  return template.replace('{event_name}', event_name).replace('{event_message}', event_message);
};

const send_email = (email_address, message) => {

  const html = processTemplate(template, { event_name: 'Cat Door Opened Mo', event_message: 'Door is now open' });
  console.log('html: ', html);
  return new Promise((resolve, reject) => {
    sendmail({
      from: 'Automate@automate.com',
      to: email_address,
      subject: 'Event- Topic: (topic), message: (message)',
      html,
    }, (err, reply) => {
      if (err) {
        reject(err);
      }
      resolve();
    });
  });
};

module.exports = send_email;

