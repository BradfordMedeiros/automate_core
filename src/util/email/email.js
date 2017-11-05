const fs = require('fs');
const path = require('path');
const sendmail = require('sendmail')({silent: true});

const replaceAll = (str, find, replace) => {
  return str.replace(new RegExp(find, 'g'), replace);
};

// replaces string with template values in braces, with the matching object key
// for example,
// | processTemplate('{greeting} world {thing} thing {thing} '
// ==> {greeting: 'hello', thing: 'yo'}) becomes 'hello world yo thing yo '
const processTemplate = (template, templateLiterals ) => {
  return Object.keys(templateLiterals).reduce((templateValue, currentKey) =>
    replaceAll(templateValue, `{${currentKey}}`, templateLiterals[currentKey]), template
  );
};

const eventNotificationTemplate =  fs.readFileSync(path.join(__dirname, 'html/event_notification.thtml')).toString();

const send_event_notification = (email_address, topic, message) => {
  const event_name = topic;
  const event_message = message;

  return new Promise((resolve, reject) => {
    sendmail({
      from: 'Automate@automate.com',
      to: email_address,
      subject: processTemplate('Event- Topic: {topic}, message: {message}', { topic, message }),
      html:  processTemplate(eventNotificationTemplate, { event_name, event_message }),
    }, err => {
      if (err) {
        reject(err);
      }else{
        resolve();
      }
    });
  });
};

const passwordResetTemplate = fs.readFileSync(path.join(__dirname, 'html/password_reset.thtml')).toString();
const send_password_reset = (email_address, automate_url) => {
  return new Promise((resolve, reject) => {
    sendmail({
      from: 'Automate@automate.com',
      to: email_address,
      subject: 'password reset',
      html:  processTemplate(passwordResetTemplate, { automate_url, reset_token: 'hello world' }),
    }, err => {
      if (err) {
        reject(err);
      }else{
        resolve();
      }
    });
  });
};

module.exports = {
  send_event_notification,
  send_password_reset,
};

