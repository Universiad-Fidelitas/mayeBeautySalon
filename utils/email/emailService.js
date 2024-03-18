const nodemailer = require("nodemailer");
const hbs = require('nodemailer-express-handlebars');
const path = require('path');

const emailService = async (template, email, subject, emailParams) => {
    try {
        const transporter = nodemailer.createTransport({
            pool: true,
            maxConnections: 1,
            maxMessages: 1,
            rateDelta: 3000,
            rateLimit: 1,
            host: 'smtp.office365.com',
            port: 587,
            secure: false,
            auth: {
               user: 'noreply@mayebeautysalon.com',
               pass: 'Bux57614'
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
            template,
            to: email,
            subject: subject,
            context: {
                ...emailParams
            },
        });
    } catch (error) {
        console.log(error, "email not sent");
    }
};

module.exports = emailService;
