// services/email.service.js
const transporter = require('../config/email.config');

/**
 * Enviar email de confirmación cuando se crea un PQRS
 */
const enviarConfirmacionPqrs = async (pqrs) => {
    try {
        const mailOptions = {
            from: `"UrbanCops - Soporte" <${process.env.EMAIL_USER}>`,
            to: pqrs.correo,
            subject: `✅ PQRS Recibido - Ticket #${pqrs.id_pqrs}`,
            html: `
                <!DOCTYPE html>
                <html>
                <head>
                    <style>
                        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
                        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
                        .ticket { background: white; padding: 20px; border-left: 4px solid #667eea; margin: 20px 0; }
                        .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
                        .btn { display: inline-block; padding: 12px 30px; background: #667eea; color: white; text-decoration: none; border-radius: 5px; margin-top: 20px; }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="header">
                            <h1>🎯 UrbanCops</h1>
                            <p>Gorras Urbanas Auténticas</p>
                        </div>
                        <div class="content">
                            <h2>¡Hola ${pqrs.nombre}!</h2>
                            <p>Hemos recibido tu <strong>${pqrs.tipo_pqrs}</strong> exitosamente.</p>
                            
                            <div class="ticket">
                                <h3>📋 Detalles de tu solicitud:</h3>
                                <p><strong>Ticket:</strong> #${pqrs.id_pqrs}</p>
                                <p><strong>Tipo:</strong> ${pqrs.tipo_pqrs}</p>
                                <p><strong>Estado:</strong> ${pqrs.estado}</p>
                                <p><strong>Fecha:</strong> ${new Date(pqrs.fecha_solicitud).toLocaleString('es-CO')}</p>
                                <p><strong>Descripción:</strong></p>
                                <p style="background: #f0f0f0; padding: 15px; border-radius: 5px;">${pqrs.descripcion}</p>
                            </div>

                            <p>Nuestro equipo revisará tu caso y te responderemos lo antes posible a este correo.</p>
                            <p><strong>Tiempo estimado de respuesta:</strong> 24-48 horas hábiles</p>
                            
                            <p style="margin-top: 30px;">Gracias por confiar en UrbanCops 🧢</p>
                        </div>
                        <div class="footer">
                            <p>© ${new Date().getFullYear()} UrbanCops - Todos los derechos reservados</p>
                            <p>Este es un correo automático, por favor no responder.</p>
                        </div>
                    </div>
                </body>
                </html>
            `
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('✅ Email de confirmación enviado:', info.messageId);
        return { success: true, messageId: info.messageId };
    } catch (error) {
        console.error('❌ Error al enviar email de confirmación:', error);
        return { success: false, error: error.message };
    }
};

/**
 * Enviar email cuando el admin responde un PQRS
 */
const enviarRespuestaPqrs = async (pqrs) => {
    try {
        const mailOptions = {
            from: `"UrbanCops - Soporte" <${process.env.EMAIL_USER}>`,
            to: pqrs.correo,
            subject: `📬 Respuesta a tu ${pqrs.tipo_pqrs} - Ticket #${pqrs.id_pqrs}`,
            html: `
                <!DOCTYPE html>
                <html>
                <head>
                    <style>
                        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                        .header { background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
                        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
                        .response { background: white; padding: 20px; border-left: 4px solid #10b981; margin: 20px 0; }
                        .original { background: #f0f0f0; padding: 15px; border-radius: 5px; margin: 20px 0; }
                        .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="header">
                            <h1>✅ UrbanCops</h1>
                            <p>Respuesta a tu solicitud</p>
                        </div>
                        <div class="content">
                            <h2>¡Hola ${pqrs.nombre}!</h2>
                            <p>Tenemos una respuesta para tu <strong>${pqrs.tipo_pqrs}</strong> (Ticket #${pqrs.id_pqrs}).</p>
                            
                            <div class="response">
                                <h3>💬 Respuesta de nuestro equipo:</h3>
                                <p>${pqrs.respuesta}</p>
                                <p style="margin-top: 15px;"><strong>Estado:</strong> ${pqrs.estado}</p>
                                <p><strong>Fecha de respuesta:</strong> ${new Date(pqrs.fecha_respuesta).toLocaleString('es-CO')}</p>
                            </div>

                            <div class="original">
                                <p><strong>Tu solicitud original:</strong></p>
                                <p>${pqrs.descripcion}</p>
                                <p style="margin-top: 10px; color: #666; font-size: 12px;">Fecha: ${new Date(pqrs.fecha_solicitud).toLocaleString('es-CO')}</p>
                            </div>

                            <p>Si tienes alguna otra duda o necesitas más información, no dudes en contactarnos nuevamente.</p>
                            
                            <p style="margin-top: 30px;">Gracias por tu paciencia y confianza en UrbanCops 🧢</p>
                        </div>
                        <div class="footer">
                            <p>© ${new Date().getFullYear()} UrbanCops - Todos los derechos reservados</p>
                            <p>Puedes responder directamente a este correo si necesitas más ayuda.</p>
                        </div>
                    </div>
                </body>
                </html>
            `
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('✅ Email de respuesta enviado:', info.messageId);
        return { success: true, messageId: info.messageId };
    } catch (error) {
        console.error('❌ Error al enviar email de respuesta:', error);
        return { success: false, error: error.message };
    }
};

module.exports = {
    enviarConfirmacionPqrs,
    enviarRespuestaPqrs
};