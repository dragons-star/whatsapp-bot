const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const nodemailer = require('nodemailer');

// Configura el servidor Express
const app = express();
const PORT = process.env.PORT || 3000;

// Usa body-parser para procesar JSON
app.use(bodyParser.json());

<<<<<<< HEAD
// Configuración de transporte para enviar correos
=======
// UltraMsg API Credentials (Cambia estos valores por los tuyos)
const instanceID = 'instance93832';
const token = '6lpwn1o1nujo0c8z';
const ultraMsgUrl = `https://api.ultramsg.com/${instanceID}/messages`;

// Configuración de nodemailer para enviar correos
>>>>>>> 82aec9f58f74f928e1d6933ed5e9ad9e5b2bab6d
const transporter = nodemailer.createTransport({
    service: 'gmail', // O el servicio de correo que prefieras
    auth: {
        user: 'registropruebas33@gmail.com',
        pass: 'ztxhnzozblgtcnps'
    }
});

<<<<<<< HEAD
// Ruta webhook para recibir mensajes de WhatsApp
app.post('/webhook', (req, res) => {
    const message = req.body.body ? req.body.body.toLowerCase() : ''; // Mensaje recibido
    const sender = req.body.sender; // Número del remitente

    console.log(`Mensaje recibido: ${message} de ${sender}`);

    if (message.includes('hola') || message.includes('nombre')) {
        // Responder al remitente usando UltraMsg
        axios.post(`https://api.ultramsg.com/instanceXXX/messages/chat`, {
            token: process.env.ULTRAMSG_TOKEN,
            to: sender,
            body: '¡Hola! ¿En qué puedo ayudarte hoy?'
        }).then(response => {
            console.log('Mensaje de respuesta enviado');
        }).catch(err => {
            console.error('Error enviando mensaje:', err);
        });

        // Enviar un correo de alerta al administrador
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: 'admin@example.com', // Correo del administrador
            subject: 'Nueva interacción en WhatsApp',
            text: `El usuario ${sender} ha enviado el mensaje: "${message}"`
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error('Error al enviar el correo:', error);
            } else {
                console.log('Correo de alerta enviado:', info.response);
            }
        });
=======
// Función para enviar el correo electrónico
function sendEmail(subject, text) {
    const mailOptions = {
        from: 'registropruebas33@gmail.com',
        to: 'registropruebas33@gmail.com',
        subject: subject,
        text: text
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log('Error al enviar el correo:', error);
        } else {
            console.log('Correo enviado:', info.response);
        }
    });
}

// Ruta del webhook para recibir mensajes de WhatsApp
app.post('/webhook', async (req, res) => {
    const { body, sender } = req.body; // Extrae el mensaje y el número del remitente

    console.log('Mensaje recibido:', req.body);

    if (body && body.toLowerCase().includes('hola')) {
        const message = `Hola, ¡gracias por tu mensaje!`;
        
        // Enviar respuesta al usuario vía UltraMsg
        try {
            await axios.post(ultraMsgUrl, {
                token,
                to: sender,
                body: message,
            });
            console.log('Mensaje enviado:', message);

            // Envía un correo electrónico con la solicitud
            sendEmail('Solicitud recibida', `Mensaje de ${sender}: ${body}`);

        } catch (error) {
            console.error('Error al enviar el mensaje:', error);
        }
    } else if (body && body.toLowerCase().includes('ayuda')) {
        const helpMessage = 'Hola, ¿en qué puedo ayudarte?';
        
        // Enviar respuesta al usuario vía UltraMsg
        try {
            await axios.post(ultraMsgUrl, {
                token,
                to: sender,
                body: helpMessage,
            });
            console.log('Mensaje de ayuda enviado:', helpMessage);

            // Envía un correo electrónico con la solicitud
            sendEmail('Solicitud de ayuda recibida', `Mensaje de ${sender}: ${body}`);

        } catch (error) {
            console.error('Error al enviar el mensaje de ayuda:', error);
        }
>>>>>>> 82aec9f58f74f928e1d6933ed5e9ad9e5b2bab6d
    }

    // Siempre responde con status 200 para que UltraMsg no marque error
    res.sendStatus(200);
});

// Inicializa el servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});
