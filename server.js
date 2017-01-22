import tcp from 'net'; // load required TCP library from Node.js default libs
import Client from './client.js'; // import Client class

class Server {
  constructor(port, address) {
    this.port = port || 5000;
    this.address = address || '127.0.0.1';

    this.clients = []; // references currently connected clients
  }

  start(cb) {
    this.connection = tcp.createServer(socket => {
      let client = new Client(socket);

      // broadcast new client connection
      this.broadcast(`${client.name} connected.\n`, client);

      this.clients.push(client); // store for later usage

      socket.on('data', data => { // triggered when this client receives data
        let message = data.toString().replace(/[\n\r]*$/, ''); // get formated string message
        socket.write(`We received your message: ${message}\n`); // notify client

        // broadcast this client's message
        this.broadcast(`${client.name} says: ${data}`, client);
      });

      socket.on('end', () => { // triggered when this client disconnects
        this.clients.splice(server.clients.indexOf(client), 1); // remove from list of connected clients

        // broadcast this client's disconnected status
        this.broadcast(`${client.name} disconnected.\n`);
      });
    });

    this.connection.listen(this.port, this.address); // start server
    this.connection.on('listening', cb); // trigger cb of the start method
  }

  broadcast(message, clientSender) { // sends messages to everyone in the network excluding itself
    this.clients.forEach(client => { // iterate through all connected clients
      if (client === clientSender) {
        return;
      }

      client.receiveMessage(message); // send the message
    });

    console.log(message.replace(/\n+$/, ""));
  }
}

export default Server;
