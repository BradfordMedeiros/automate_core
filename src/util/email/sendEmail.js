const sendmail = require('sendmail')({silent: true});

const send_email = (email_address, message) => {
  return new Promise((resolve, reject) => {
    sendmail({
      from: 'automate@router.com',
      to: email_address,
      subject: 'Event Triggered',
      html:  message,
    }, function(err, reply) {
      if (err) {
        reject(err);
      }
      resolve();
    });
  });
};

module.exports = send_email;

