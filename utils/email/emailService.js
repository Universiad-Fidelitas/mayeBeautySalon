const nodemailer = require("nodemailer");
const hbs = require('nodemailer-express-handlebars');
const path = require('path');

const emailService = async (email, subject, resetLink) => {
    try {
        const transporter = nodemailer.createTransport({
            host: 'smtp.office365.com',
            port: 587,
            secure: false,
            auth: {
               user: 'noreply@mayebeautysalon.com',
               pass: 'Waj55523'
            },
        });
        
        // point to the template folder
        const handlebarOptions = {
            viewEngine: {
                partialsDir: path.resolve('./utils/email'),
                defaultLayout: false,
            },
            viewPath: path.resolve('./utils/email'),
        };

        // use a template file with nodemailer
        transporter.use('compile', hbs(handlebarOptions))

        await transporter.sendMail({
            from: 'noreply@mayebeautysalon.com',
            template: 'passwordRecoveryEmail',
            to: email,
            subject: subject,
            context: {
                resetLink
              },
        });


        console.log("email sent sucessfully");
    } catch (error) {
        console.log(error, "email not sent");
    }
};

module.exports = emailService;
