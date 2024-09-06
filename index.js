const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const axios = require('axios');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Configuración de transporte de nodemailer
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// Ruta webhook para recibir mensajes de WhatsApp
app.post('/webhook', (req, res) => {
    const message = req.body.body.toLowerCase(); // Mensaje recibido
    const sender = req.body.sender; // Número del remitente

    // Si el mensaje contiene "nombre" o "tu_nombre"
    if (message.includes('nombre') || message.includes('tu_nombre')) {
        // Responder al remitente
        axios.post(`https://api.ultramsg.com/instanceXXX/messages/chat`, {
            token: process.env.ULTRAMSG_TOKEN,
            to: sender,
            body: '¡Hola! ¿En qué puedo ayudarte hoy?'
        }).then(response => {
            console.log('Mensaje enviado');
        }).catch(err => {
            console.log('Error enviando mensaje:', err);
        });

        // Enviar correo de alerta
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: 'admin@example.com', // El correo del administrador
            subject: 'Alerta de WhatsApp',
            text: `El usuario ${sender} ha enviado: ${message}`
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log('Error enviando correo:', error);
            } else {
                console.log('Correo enviado:', info.response);
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
