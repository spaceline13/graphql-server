import nodemailer from 'nodemailer';

exports.sendEmail = function(from,to,subject,html){
    let transporter = nodemailer.createTransport({
        host: 'smtp.agroknow.com',
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: 'mailer@agroknow.com', // generated ethereal user
            pass: 'Grammou17' // generated ethereal password
        },
        tls: {
            rejectUnauthorized: false
        }
    });
    // setup email data with unicode symbols
    let mailOptions = {
        from: from, // sender address
        to: to, // list of receivers
        subject: subject, // Subject line
        text: '', // plain text body
        html: html // html body
    };
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }
        console.log('Message sent: %s', JSON.stringify(info));
    });
}