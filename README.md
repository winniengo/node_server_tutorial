# Walkthrough of TCP Server with Node.js [Tutorial](http://frostybay.com/articles/tcp-server-with-nodejs) 
by Richard Eitz

Topics covered:
+ Setup and configuration of a Node.js app
+ Understanding how TCP works
+ Handling incoming connections and messages
+ Managing clients
+ Broadcasting events to clients

## Socket Server

A _socket_ is one endpoint of a two-way communication link between two programs running on the network. A socket is bound to a port number so that the TCP layer can identify the application that data is destined to be sent to.

Normally, a server runs on a specific computer and has a socket that is bound to a specific port number. The server just waits, listening to the socket for a client to make a connection request.

### Client-side
The client knows the hostname of the machine on which the server is running and the port number on which the server is listening. To make a connection request, the client tries to rendezvous with the server on the server's machine and port. The client also needs to identify itself to the server so it binds to a local port number that it will use during this connection. This is usually assigned by the system.

If everything goes well, the server accepts the connection. Upon acceptance, the server gets a new socket bound to the same local port and also has its remote endpoint set to the address and port of the client. It needs a new socket so that it can continue to listen to the original socket for connection requests while tending to the needs of the connected client.

On the client side, if the connection is accepted, a socket is successfully created and the client can use the socket to communicate with the server.

The client and server can now communicate by writing to or reading from their sockets.

### An Endpoint
An endpoint is a combination of an IP address and a port number. Every TCP connection can be uniquely identified by its two endpoints. That way you can have multiple connections between your host and the server.


## TCP

_Transmission Control Protocol_ provides reliable, ordered, and error-checked delivery of a stream of octets between apps running on hosts communicating over an IP network.

In other words the protocol can guarantee that what you send through the network and over IP is always arrived on the other end. TCP also has the special feature of keeping the connections opened for later reference and usage.

## _Client-Server_ Paradigm

1. A program called the _server_ blocks waiting for a _client_ to connect to it
2. A client connects to the server at an IP Address and a Port (eg. 127.0.0.1:3000).
3. The server accepts the connection. Now the client can keep a reference to the "pipe" that goes to the server and vice versa.
3. The server and client exchange information until they're done.
4. The client and server both close their connection. The connection can be closed by any side.

Additional Notes:
+ Hosts have _ports_ numbered from 0-65535. Servers listen on a port.
+ Multiple clients can be communicating with a server on a given port. Each client connection is assigned a separate _socket_ on that port.
+ Client applications get a port and a socket on the client machine when they connect successfully with a server.

## Phase 1: Booting up
`index.js`

1. Import TCP library from the Node.js default libs `'net'`.
2. Setup default configuration for `PORT` and `ADDRESS` values.
3. Create a new TCP `server` and pass as a callback `onClientConnected` which will be executed whenever a new client connects to `server`.

To run:

1. Set the file to be executed with `chmod +x index.js`.
2. Start the server with `npm start`.
3. Receive `Server started at: 127.0.0.1:5000` message.
4. Test using [telnet](https://en.wikipedia.org/wiki/Telnet). Run `telnext 127.0.0.1 5000` in another terminal.
5. Receive a message like `New client: 127.0.0.1:64637`.

Recap: Create a server that accepts a client connection, displayed information about the client and closed the connection. `onClientConnected` is executed only once, when the client connects.

## Phase 2: Sending Messages
`index.js`
+ Set up two events:
  + `socket.on('data', callback )` calls `callback` when the server receives data from the client. `data` can be a bugger of bytes or a string.
  + `socket.on('end', callback )` calls `callback` when the client disconnects from the server.

To run:
  
1. Run `telnext 127.0.0.1 5000`.
2. Write a message to server.

  Sample outputs:
  + Server
    ```
    Server started at: 127.0.0.1:5000
    127.0.0.1:54052 connected.
    127.0.0.1:54052 said: Hey
    127.0.0.1:54052 disconnected.
    ```
  + Client
    ```
    $ telnet localhost 5000
    Trying 127.0.0.1...
    Connected to localhost.
    Escape character is '^]'.
    Hey
    We got your message: Hey
    ^]
    telnet> q
    Connection closed.
    ```

## Phase 3: Multiple Clients

**NB**: Broadcasting is the act of sending a message to everyone on the network.

Abstract into `Server` and `Client` classes.
`init.js`
+ Import `Server` class and start a new instance of a `Server` at default configuration.

`server.js`

1. Import TCP library `'net'` and `Client` class.
2. `constructor(port, address)` sets up values for `start` method and initializes a `clients` array that references all connected clients.
3. `start(cb)` contains the contents of `onClientConnected` and instantiates a `Client` instance and adds it to `this.clients` array. `cb` is executed when the server finishes initializing.
