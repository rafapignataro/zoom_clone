const server = require('http').createServer((request, response) => {
  {
    response.writeHead(204, {
      'Access-control-Allow-Origin': '*',
      'Access-control-Allow-Methods': 'OPTIONS, POST, GET',
    });
    response.end('Hey there!');
  }
});

const socketIo = require('socket.io');
const io = socketIo(server, {
  cors: {
    origin: '*',
    credentials: false,
  },
});

io.on('connection', (socket) => {
  console.log('connected', socket.id);
  socket.on('join-room', (roomId, userId) => {
    // Adiciona os usuários na mesma sala
    socket.join(roomId);
    // Avisa todos da sala do novo usuário
    socket.to(roomId).broadcast.emit('user-connected', userId);
    // Aviso de dosconexão
    socket.on('disconnect', () => {
      console.log('disconnected', roomId, userId);
      socket.to(roomId).broadcast.emit('user-disconnected', userId);
    });
  });
});

const startServer = () => {
  const { address, port } = server.address();
  console.info(`APP RUNNING AT ${address}:${port}`);
};

server.listen(process.env.PORT || 3000, startServer);
