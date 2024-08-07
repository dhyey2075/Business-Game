const express = require('express');
const { createServer } = require('node:http');
const { join } = require('node:path');
const { Server } = require('socket.io');
const cors = require('cors');


const app = express();
app.use(cors());
const server = createServer(app);
const io = require('socket.io')(server, {
  cors: {
      origin: '*',
      methods: ['GET', 'POST']
  }
});
users = {};
roomToUser = [];
socketidToName = {}
players = {};

app.get('/', (req, res) => {
  res.send("Hello World");
});

io.on('connection', (socket) => {
    console.log(socket.id,' connected');
    socket.on('disconnect', () => {
      console.log(socket.id, 'disconnected');
      
      const room = users[socket.id];
      const userName = socketidToName[socket.id];
  
      if (userName) {
        io.to(room).emit('user disconnected', userName);
      }
  
      if (room) {
        // Remove the user from the room's player list
        const index = players[room]?.findIndex((p) => p.id === socket.id);
        if (index !== -1) {
          players[room].splice(index, 1);
  
          // If no players are left in the room, delete the room
          if (players[room].length === 0) {
            delete players[room];
            io.emit('room closed', room);
          }
        }
  
        // Remove the room from roomToUser
        const roomIndex = roomToUser.indexOf(room);
        if (roomIndex !== -1) {
          roomToUser.splice(roomIndex, 1);
        }
  
        // Clean up users and mappings
        delete users[socket.id];
        delete socketidToName[socket.id];
        
        console.log("users", users);
        console.log("roomToUser", roomToUser);
      }
    });

    socket.on('room close req', (room) => {
      let index = players[room].findIndex((p) => p.id === socket.id);
      players.splice(index, 1);
      console.log("user", users)
      console.log("roomToUser",roomToUser)
      console.log("players", players)
    })

    socket.on('create room', (room, name) => {
        if(roomToUser.includes(room)){
            socket.emit('room already created', room, socket.id, name);
        }
        else{
          socket.join(room);
          socketidToName[socket.id] = name;
          users[socket.id] = room;
          roomToUser.push(room);
          console.log("user", users)
          console.log("roomToUser", roomToUser)
          console.log(socketidToName)
          if (!(room in players)) {
            players[room] = []
          }
          players[room].push({name: name, id: socket.id});
          console.log("players", players)
          io.to(room).emit('room created', room, socket.id, name);
        }
    });
    socket.on('join room', (room, name) => {
        const count = roomToUser.filter((r)=> r===room).length;
        if(count === 0){
          socket.emit('room not found', room, socket.id);
        }
        
        else if(count < 4){
          socket.join(room);
          users[socket.id] = room;
          roomToUser.push(room);
          console.log("user", users)
          console.log("roomToUser", roomToUser)
          if (!(room in players)) {
            players[room] = [];
          }
          players[room].push({name: name, id: socket.id});
          console.log("players", players)
          io.to(room).emit('joined room', room, socket.id, name);
          if(players[room].length === 4){
            socket.emit('send players', room, players[room]);
          }
        }
        else{
          socket.emit('room full', room, socket.id, name);
        }
        console.log("players", players) 
        socket.on('start game server', (room) => {
          console.log("Game started in room-", room);
          io.to(room).emit('game started client', room);
        })
    })
    socket.on('get players', (room) => {
      console.log(room);
      console.log("players", players[room]);
      io.to(room).emit('send players', room, players[room]);
    })
})

server.listen(3000, () => {
  console.log('server running at http://localhost:3000');
});