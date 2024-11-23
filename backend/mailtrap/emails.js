import { mailtrapClient, sender } from "./mailtrap.config.js";
import { PASSWORD_RESET_REQUEST_TEMPLATE, VERIFICATION_EMAIL_TEMPLATE } from "./emailTemplates.js";

// Enviar email con token de verificacion
export const sendVerificationEmail = async (email, verificationToken) => {
    const recipient = [{ email }];

    try {
        const response = await mailtrapClient.send({
            from:sender,
            to:recipient,
            subject:"Verifique su email",
            html: VERIFICATION_EMAIL_TEMPLATE.replace("{verificationCode}", verificationToken),
            category: "Verificación Email",
        })
        console.log("Correo de verificación enviado con éxito", response);
    } catch (error) {
        console.error("Error al enviar el correo de verificación", error);
        throw new Error(`Error al enviar el email de verificación: ${error}`);
    }
};

// Enviar email de bienvenida
export const sendWelcomeEmail = async (email, name) => {
    const recipient = [{ email }];

    try {
        const response = await mailtrapClient.send({
            from: sender,
            to: recipient,
            //subject: "Gracias por elegirnos",
            template_uuid: "0fdc66ca-a477-4d97-8d82-d8b754c994ff",
            //category: "welcome",
            template_variables: {
                "company_info_name": "Test_Company_info_name",
                "name": name,
                "company_info_address": "Test_Company_info_address",
                "company_info_city": "Test_Company_info_city",
                "company_info_zip_code": "Test_Company_info_zip_code",
                "company_info_country": "Test_Company_info_country"
              },

        })
        console.log("Correo de bienvenida enviado con éxito", response);
    } catch (error) {
        console.error("Error al enviar el correo de bienvenida", error);
        throw new Error(`Error al enviar el email de bienvenida: ${error}`);
    }
};

// Enviar email de recuperacion de contraseña
export const sendPasswordResetEmail = async (email, resetURL) => {
    const recipient = [{ email }];

    try {
        const response = await mailtrapClient.send({
            from: sender,
            to: recipient,
            subject: "Recuperación de contraseña",
            html: PASSWORD_RESET_REQUEST_TEMPLATE.replace("{resetURL}", resetURL),
            category: "Password Reset",
        })
        console.log("Correo de recuperación de contraseña enviado con éxito", response);
    } catch (error) {
        console.error("Error al enviar el correo de recuperación de contraseña", error);
        throw new Error(`Error al enviar el email de recuperación de contraseña: ${error}`);
    }
};