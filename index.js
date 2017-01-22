#!/usr/bin/env node
'use strict';

const tcp = require('net'); // load required TCP library from Node.js default libs

const PORT = 5000;
const ADDRESS = '127.0.0.1'; // setup default configuration

const server = tcp.createServer(onClientConnected); // create a new TCP
server.listen(PORT, ADDRESS); // set to listen at the default config values

function onClientConnected (socket) { // execute whenever a new client connects to the server
  let clientName = (`New client: ${socket.remoteAddress}:${socket.remotePort}`); // name client
  console.log(`${clientName} connected.`);// display information about client

  socket.on('data', data => { // triggered when this client receives data
    let message = data.toString().replace(/[\n\r]*$/, ''); // get formated string message
    console.log(`${clientName} said: ${message}`); // display client's message
    socket.write(`We received your message: ${message}\n`); // notify client
  });

  socket.on('end', () => { // triggered when this client disconnects
    console.log(`${clientName} disconnected.`);
  });

  // socket.destroy();
}

console.log(`Server started at: ${ADDRESS}:${PORT}`);
