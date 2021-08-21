const express = require('express');
const http= require('http');
const path = require('path');
const socketio = require('socket.io');
const Filter = require('bad-words');
const { generateMessage, generateLocationMessage } = require('./utils/messages');
const { addUser, removeUser, getUser, getUsersInRoom } = require('./utils/users')


const port = process.env.PORT || 3000
const publicDirPath = path.join(__dirname, '../public');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

app.use(express.static(publicDirPath));

let welcomeMessage = "Welcome!";
let leaveMessage = "A user has left!";

io.on('connection', (socket) => {
    console.log('New WebSocket connection');

    

    socket.on('join', ({ username, room }, callback) => {
        const { error, user } = addUser({ id: socket.id, username, room })
        
        if (error) {
            return callback(error);
        }

        socket.join(user.room);

        //send message event to new client
        socket.emit('message', generateMessage(welcomeMessage));

        //broadcast to all other client when new client connects
        socket.broadcast.to(user.room).emit('message', generateMessage(`${user.username} has joined!`)); 
        
        io.to(user.room).emit('roomData', {
            room: user.room,
            users: getUsersInRoom(user.room),
        })
        callback();
    })

    //listen to sendMessage event from clients
    socket.on('sendMessage', (clientMessage, callback) => {
        const filter = new Filter();

        if (filter.isProfane(clientMessage)) {
            return callback('Profanity is not allowed');
        }

        const user = getUser(socket.id);
        io.to(user.room).emit('message', generateMessage(user.username, clientMessage));
        callback();
    })

    //listen when the client disconnect
    socket.on('disconnect', () => {
        const user = removeUser(socket.id)

        if (user) {
            io.to(user.room).emit('message', generateMessage(`${user.username} has left!`));
            io.to(user.room).emit('roomData', {
                room: user.room,
                users: getUsersInRoom(user.room)
            })
        }
    })

    //listen to sendLocation event
    socket.on('sendLocation', (location, callback) => {
        const user = getUser(socket.id)
        io.to(user.room).emit('locationMessage', generateLocationMessage(user.username, `https://google.com/maps?q=${location.latitude},${location.longitude}`));
        callback();
    })
})

server.listen(port, () => {
    console.log(`Server is up on port ${port}`);
})