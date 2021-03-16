const sgMail = require("@sendgrid/mail");
const sendGridApiKey = process.env.SENDGRID_API_KEY;
sgMail.setApiKey(sendGridApiKey);


const sendWelcomeEmail = (email, name) => {
  
    sgMail.send({
        to: email,
        from: "alex.monteil@outlook.com",
        subject: "Thanks for joining in!",
        text: `Welcome to the app, ${name}. Let me know how you get along with the app.`
    });
}


const sendCancelEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: "alex.monteil@outlook.com",
        subject: "We hope to see you again!",
        text: `Thank you for using our platform ${name}, we are sorry to see you go. We would appreciate your feedback or reason for cancellation at feedback@example.com`
    });
}



module.exports = {
    sendWelcomeEmail,
    sendCancelEmail
}
