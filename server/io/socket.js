function start(io) {

    const users = io.of('/users');
    const chat = io.of('/chat');

    users.on('connection', socket => {
        users.emit('count', {count: io.engine.clientsCount});
        socket.on('disconnect', () => users.emit('count', {count: io.engine.clientsCount}));

    });

    chat.on('connection', async socket => {
        let room, username;

        socket.on('chat-connect', data => {
            room = data.guild;
            username = data.username;

            socket.join(room);
            chat.to(room).emit(room, {username: 'SERVER', text: `${username} CONNECTED`});
            socket.on(room, data => chat.to(room).emit(room, data));
        });

        socket.on('disconnect', () => {
            chat.to(room).emit({username: 'SERVER', text: `${username} DISCONNECTED`});
            socket.leave(room);
        })
    });
}

export default {start: start};