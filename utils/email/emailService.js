const nodemailer = require("nodemailer");

const emailService = async (email, subject, text) => {
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
                refreshToken: '1//04OzB9MUNBDI1CgYIARAAGAQSNwF-L9IrUhbMkRv-ajfhDhTTPY3ORGhpsSGhpVVfZCeaUN-O06wFOFZneJPLEdwwz9zU0kftPaA',
                accessToken: 'ya29.a0AfB_byAkyABPw9-IJRCChWTnDlVU2Pc4cHw8ToToeLrh2vT6V-O7yOmH5eJ81qGrjrRJf5NLsQkNHaywLRShmK1rwrgIT1rixr5GMfk6DqwpEB1lhnoWk32K_RG9hHydZeaRJC7DhzTRZ_JvATFbcQsLxgQZ6S8NK3ZfaCgYKAYsSARESFQHGX2Miqsz1Yh1sOocuRzLYp8dg4Q0171'
            }
        });

        await transporter.sendMail({
            from: 'noreply.mayebeautysalon@gmail.com',
            to: email,
            subject: subject,
            text: text,
        });

        console.log("email sent sucessfully");
    } catch (error) {
        console.log(error, "email not sent");
    }
};

module.exports = emailService;
