
const mailGenerator = new Mailgen({
    theme: 'default',
    product: {
        name: 'Nombre web',
        link: 'https://pagina.com'
    }
});

export default function createMail(type, args) {
    switch (type) {
        case 'otpMail':
            return getOTPMailTemplate(args);
        case 'registerMail':
            return getRegisterMailTemplate(args);
        case 'resetPasswordMail':
            return getResetPasswordMailTemplate(args);
        case 'resendOtpMail':
            return getResendOTPMailTemplate(args);
        default:
            return null;
    }
}
// OTP Mail Template
function getOTPMailTemplate({ otp }) {
    return mailGenerator.generate({
        body: {
            name: 'Usuario',
            intro: 'Utiliza el siguiente código para verificar tu cuenta:',
            action: {
                instructions: `Tu código de verificación es: ${otp}`,
                button: {
                    color: '#22BC66', 
                    text: `Código OTP: ${otp}`,
                    link: 'https://tuapp.com/verificar'
                }
            },
            outro: 'Si no solicitaste este código, ignora este mensaje.'
        }
    });
}

// Register Mail Template
function getRegisterMailTemplate({ name }) {
    return mailGenerator.generate({
        body: {
            name: name,
            intro: 'Gracias por registrarte en nuestra plataforma.',
            action: {
                instructions: 'Haz clic en el siguiente botón para verificar tu cuenta:',
                button: {
                    color: '#22BC66',
                    text: 'Verificar cuenta',
                    link: 'https://tuapp.com/verificar'
                }
            },
            outro: '¡Nos alegra que te unas a nosotros!'
        }
    });
}

// Reset Password Mail Template
function getResetPasswordMailTemplate({ resetLink }) {
    return mailGenerator.generate({
        body: {
            name: 'Usuario',
            intro: 'Recibimos una solicitud para restablecer tu contraseña.',
            action: {
                instructions: 'Haz clic en el siguiente botón para restablecer tu contraseña:',
                button: {
                    color: '#DC4D2F',
                    text: 'Restablecer Contraseña',
                    link: resetLink
                }
            },
            outro: 'Si no solicitaste restablecer la contraseña, ignora este mensaje.'
        }
    });
}

// Resend OTP Mail Template
function getResendOTPMailTemplate({ otp }) {
    return mailGenerator.generate({
        body: {
            name: 'Usuario',
            intro: 'Este es un recordatorio con tu código OTP:',
            action: {
                instructions: `Tu código OTP es: ${otp}`,
                button: {
                    color: '#22BC66',
                    text: `Código OTP: ${otp}`,
                    link: 'https://tuapp.com/verificar'
                }
            },
            outro: 'Si no solicitaste este código, ignora este mensaje.'
        }
    });
}
 
 /**export default function newMail (type, args) {
    switch (type) {
        case 'otpMail':
            return getOTPMailTemplate(args);
        case 'registerMail':
            return getRegisterMailTemplate(args);
        default:
            return null;
    }

}


    otra forma de hacerlo
    
export default function createMail(type, args) {
    switch (type) {
        case 'otpMail':
            return getOTPMailTemplate(args);
        case 'registerMail':
            return getRegisterMailTemplate(args);
        default:
            return null;
    }
}

function getOTPMailTemplate({ otp }) {
    const email = {
        body: {
            name: 'Usuario',
            intro: 'Utiliza el siguiente código para verificar tu cuenta:',
            action: {
                instructions: `Tu código de verificación es: ${otp}`,
                button: {
                    color: '#22BC66', // Puedes cambiar el color del botón
                    text: `Código OTP: ${otp}`,
                    link: 'https://tuapp.com/verificar'
                }
            },
            outro: 'Si no solicitaste este código, ignora este mensaje.'
        }
    };

    return mailGenerator.generate(email);
}

async function sendOtpEmail(recipientEmail, otp) {
    const mailContent = getOTPMailTemplate({ otp });

    const mailOptions = {
        from: 'tuemail@example.com',
        to: recipientEmail,
        subject: 'Tu código de verificación OTP',
        html: mailContent
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('Correo enviado con éxito');
    } catch (error) {
        console.error('Error al enviar el correo:', error);
    }
}

    */