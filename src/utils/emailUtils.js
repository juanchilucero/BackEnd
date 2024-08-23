import nodemailer from 'nodemailer';
import { config } from '../config/config.js';

// Configuración del transportador de nodemailer
const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: config.emailUser, // Tu dirección de correo electrónico
        pass: config.emailPassword // Tu contraseña o contraseña de aplicación
    }
});

// Función para enviar el correo de restablecimiento de contraseña
export const sendPasswordResetEmail = async (email, token) => {
    const resetUrl = `${config.frontendUrl}/reset-password/${token}`;
    const message = {
        from: config.emailUser,
        to: email,
        subject: 'Solicitud de Restablecimiento de Contraseña',
        text: `Has solicitado restablecer tu contraseña. Por favor, utiliza el siguiente token para restablecer tu contraseña: ${token}. Enlace para restablecer tu contraseña: ${resetUrl}`,
        html: `
            <p>Has solicitado restablecer tu contraseña. Por favor, utiliza el siguiente token para restablecer tu contraseña:</p>
            <p><strong>${token}</strong></p>
            <p>Si prefieres, puedes utilizar el siguiente enlace para restablecer tu contraseña:</p>
            <p><a href="${resetUrl}">${resetUrl}</a></p>
        `
    };
    
    return transporter.sendMail(message);
};
