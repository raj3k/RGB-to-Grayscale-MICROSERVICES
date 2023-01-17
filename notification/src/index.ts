import { Server } from "socket.io";

const io = new Server({
    cors: {
        origin: "*"
    }
});

io.on('connection', (socket) => {
    console.log('user connected');
    socket.on('disconnect', () => {
        console.log('user disconnected')
    });
});

io.listen(8080);