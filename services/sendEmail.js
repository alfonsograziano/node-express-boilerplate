const nodeMailer = require("nodemailer");
require("dotenv").config();

const sendEmail = (from,to,subject, html, callback)=> {
    const options = {
        host: process.env.SMTP_SERVER,
        port: process.env.SMTP_PORT,
        secure: true,
        auth: {
            user: process.env.EMAIL,
            pass: process.env.PSW_EMAIL
        }
    }

    let transporter = nodeMailer.createTransport(options);
    let mailOptions = { from, to, subject,html, text: "Test"}

    transporter.sendMail(mailOptions, (err, info) => {callback(err, info)})
}


module.exports = sendEmail

