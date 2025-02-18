// video-call-server/server.js

const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const port = 3003;
const app = express();
const server = http.createServer(app);

const io = socketIo(server, {
  cors: [{
    origin: "http://app.vidkar.com:3000",  // Permitir solicitudes del cliente Meteor (puerto 3000)
    methods: ["GET", "POST"],
  },{
    origin: "http://localhost:3000",  // Permitir solicitudes del cliente Meteor (puerto 3000)
    methods: ["GET", "POST"],
  },{
    origin: "https://www.vidkar.com",  // Permitir solicitudes del cliente Meteor (puerto 3000)
    methods: ["GET", "POST"],
  },{
    origin: "https://w59x5nmk-3000.brs.devtunnels.ms",  // Permitir solicitudes del cliente Meteor (puerto 3000)
    methods: ["GET", "POST"],
  }],
});


app.get('/', (req, res) => {
  res.send('Servidor Socket.IO en ejecución');
});

// Manejo de eventos de conexión
io.on('connection', (socket) => {
  console.log('Nuevo cliente conectado');

  // Enviar un mensaje al cliente cada vez que se conecta
  socket.emit('message', 'Bienvenido al servidor de videollamadas');

  // Escuchar los mensajes enviados por el cliente
  socket.on('send-message', (data) => {
    console.log('Mensaje recibido del cliente:', data);
    io.emit('message', 'Mensaje del servidor: ' + data);
  });

  // Recibir el video
  socket.on('send-video', (frameData) => {
    // console.log('Frame de video recibido de un cliente');
    // Enviar el frame a todos los clientes conectados, excepto al que lo envió
    console.log("reciviendo data de video: " , JSON.stringify(frameData));
    socket.broadcast.emit('receive-video', frameData);
  });
  

  socket.on('disconnect', () => {
    console.log('Cliente desconectado');
  });
});

server.listen(port, () => {
  console.log('Servidor de VideoCalls escuchando en Port:', port);
});
