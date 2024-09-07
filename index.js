const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const nodemailer = require('nodemailer');

const app = express();
app.use(bodyParser.json());

// Configuración del correo electrónico
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'registropruebas33@gmail.com',
        pass: 'ztxhnzozblgtcnps'  // Cambia esto con tus credenciales
    }
});

// Ruta para recibir los mensajes de UltraMsg
app.post('/webhook', (req, res) => {
    const body = req.body;

    // Verificar si es un evento de mensaje recibido
    if (body.event_type === 'message_received') {
        const message = body.data.body.toLowerCase();  // Convertimos el mensaje a minúsculas
        const from = body.data.from;  // Quien envió el mensaje
        const isGroup = body.data.to.includes('-');  // Verifica si el mensaje es de un grupo
        const to = body.data.to;  // A quién se envió el mensaje (bot)
        const pushname = body.data.pushname;  // Nombre del remitente

        console.log('Mensaje recibido:', message);
        
        // Verificar si es un saludo o "estimados" en un grupo
        if (message.includes('hola') || message.includes('saludo') || (isGroup && message.includes('estimados'))) {
            // Responder a los saludos o a "estimados"
            enviarMensaje(from, '¡Hola! ¿En qué puedomos ayudarte?');
        }

        // Verificar si el mensaje está dirigido al bot en un grupo
        if (isGroup && message.includes('@Comcel_Nuevo_Pruebas')) {  // Cambia @nombre_del_bot por el nombre que usa el bot en el grupo
            // Si mencionan al bot en el grupo, responde y envía correo
            enviarMensaje(from, `¡Hola! ${pushname}, estoy aquí para ayudarte. Vamos a revisar tu solicitud.`);
            enviarEmail('registropruebas33@gmail.com', 'Mención en grupo', `El bot fue mencionado en el grupo con el mensaje: ${message}`);
        }

        // Enviar un correo electrónico para cualquier mensaje dirigido directamente al bot o en el grupo
        if (!isGroup || message.includes('@Comcel_Nuevo_Pruebas')) {
            enviarEmail('registropruebas33@gmail.com', 'Nuevo mensaje recibido', `Mensaje de ${pushname} (${from}): ${message}`);
        }
    }

    // Responder a UltraMsg que el evento fue recibido
    res.status(200).send('EVENT_RECEIVED');
});

// Función para enviar un mensaje por WhatsApp usando UltraMsg
function enviarMensaje(to, body) {
    axios.post('https://api.ultramsg.com/instance94025/messages/chat', {  // Reemplaza "XXXXX" con tu instancia
        token: 'ebbb98f73k97lvyk',  // Reemplaza con tu token de UltraMsg
        to: to,
        body: body,
    }).then(response => {
        console.log('Mensaje enviado: ', response.data);
    }).catch(error => {
        console.error('Error enviando mensaje: ', error);
    });
}

// Función para enviar un correo electrónico
function enviarEmail(to, subject, text) {
    const mailOptions = {
        from: 'registropruebas33@gmail.com',  // Cambia esto por tu email
        to: to,
        subject: subject,
        text: text
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log('Error enviando email: ', error);
        } else {
            console.log('Email enviado: ' + info.response);
        }
    });
}

// Configuración del servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`);
});
