
function sendEmail (mandrillKey, email, html, subject, fromEmail) {
    var mandrill = require('node-mandrill')(mandrillKey);

    mandrill('/messages/send', {
        message: {
            to: [
                { email: email  }
            ],
            from_email: fromEmail,
            subject: subject,
            html: html
        }
    }, function(error, response) {
        //uh oh, there was an error
        if (error) console.log( JSON.stringify(error) );

        //everything's good, lets see what mandrill said
        else console.log(response);
    });
}

module.exports = {
    sendEmail: sendEmail
};
