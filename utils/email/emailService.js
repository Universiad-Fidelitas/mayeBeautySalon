const nodemailer = require("nodemailer");
const hbs = require('nodemailer-express-handlebars');
const path = require('path');

const emailService = async (email, subject, resetLink) => {
    try {
        const transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            service: 'gmail',
            auth: {
                user: 'noreply.mayebeautysalon@gmail.com',
                pass: 'M~5rD^eivb2u4?w',
            },
            auth: {
                type: 'OAuth2',
                user: 'noreply.mayebeautysalon@gmail.com',
                clientId: '991493857162-veebs0tqhso9j798h0al9fi27nk2imql.apps.googleusercontent.com',
                clientSecret: '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',
                refreshToken: '1//04mPEZwWwnr_lCgYIARAAGAQSNwF-L9Irdjoxq0pbdojDChXJz1VI7Ke9ArHqak3aJPYCOKvr17pFsAOm7HQ4eVnHK6OOygAwLuY',
                accessToken: 'ya29.a0AfB_byCTpqfAd-ZhHGFb43ebUkzlE1xlA1BkP_xvM_2N6nHux1OH9niL5ZbLsDT2-a4vjIVnSKh_WdNR9EOUCDxDeqTc0IsYhral-vw8OYgU_9NwajZQpDeIv_EZjZX9D-jroy14MJHtHyyj74nMObVczxPrUOr6okdtaCgYKAbQSARESFQHGX2MiWi8hChn0vu-Ek3_nKDGqgg0171'
            }
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
            from: 'noreply.mayebeautysalon@gmail.com',
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
