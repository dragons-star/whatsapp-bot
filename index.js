const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const axios = require('axios');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Configuración de transporte para enviar correos
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

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
    }

    res.status(200).send('OK');
});

// Iniciar el servidor
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Servidor corriendo en el puerto ${port}`);
});
