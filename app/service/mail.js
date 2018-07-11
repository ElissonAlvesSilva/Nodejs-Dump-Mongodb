'use strict'

const nodemailer = require('nodemailer');
const fs = require('fs');
const handlebars = require('handlebars');


const from = "elisson.silva@buritech.com.br";
const from_password = "elisson123@@";
const smtp = "host282.hostmonster.com";


const transporter = nodemailer.createTransport({
    // SES: ses 
    host: smtp,
    port: 465,
    secure: true, // true for 465, false for other ports
    auth: {
        user: from, // generated ethereal user
        pass: from_password // generated ethereal password
    }
});



exports.send_mail_backup_feedback = (destinatario, date, hour) => {

    const template = fs.readFileSync(__dirname + '/../template/email_cadastro.html', 'utf-8');
    const compiledTemplateHtml = handlebars.compile(template);

    let replacements = {
        date: date,
        hour: hour
    };
    let htmlToSend = compiledTemplateHtml(replacements);
    let mailOptions = {
        from: from,
        to: destinatario,
        subject: 'Backup RH Mobi',
        html: htmlToSend,
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }
        console.log('Message sent: %s', info.messageId);
        console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
    });


}