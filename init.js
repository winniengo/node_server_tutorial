#!/usr/bin/env node
'use strict';

import Server from './server.js'; // import Server class

const PORT = 5000; // setup default configuration
const ADDRESS = '127.0.0.1';

const server = new Server(PORT, ADDRESS);
console.log(server);

server.start(() => {
  console.log(`Server started at: ${ADDRESS}:${PORT}`);
});
