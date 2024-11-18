import nodemailer from 'nodemailer';
import newMail from './newMail';
import dotenv from 'dotenv';
dotenv.config();
/*

const transporter = nodemailer.createTransport({
    service: 'gmail',
    port: 587,
    auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD,
    },
});

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
       // user: 'tuemail@example.com',
       // pass: 'tucontrasena'
    }
});

// enviar email
async function sendEmail(type, recipientEmail, args) {
    const mailContent = newMail(type, args);

    const mailOptions = {
        from: 'tuemail@example.com',
        to: recipientEmail,
        subject: 'Notificación de tu aplicación',
        html: mailContent
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('Correo enviado con éxito');
    } catch (error) {
        console.error('Error al enviar el correo:', error);
    }
}

export {sendEmail};

*/
