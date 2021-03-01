const sgMail = require('@sendgrid/mail')

sgMail.setApiKey(process.env.SENDGRID_API_KEY)///letting send grid for which api key we are working

// sgMail.send({
//     to: 'atulanandap@gmail.com',
//     from: 'atulanandap@gmail.com',
//     subject: 'This is a creation',
//     text: 'reaching Out'
// })

const sendWelcomeEmail = (email,name) => {
    sgMail.send({
        to:email,
        from: 'atulanandap@gmail.com',
        subject: 'Thanks for joining in !!',
        text: `welcome to the app, ${name}. Let us know how you get along with the app` //es6 template //used backticks
        // html:'' // we can also opt to send a email as a welcoming picture and message
    })
}

const sendCancelationEmail = (email,name) => {
    sgMail.send({
        to:email,
        from: 'atulanandap@gmail.com',
        subject: 'Thanks for using our service !!',
        text: `Goodbye, ${name}. Hope to see you back with our service`
    })
}  


module.exports = {
    sendWelcomeEmail,
    sendCancelationEmail
}



