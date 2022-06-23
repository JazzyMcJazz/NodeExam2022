function start(io) {

    io.on('connection', socket => {

        io.emit('count', {count: io.engine.clientsCount});

        socket.on('disconnect', () => {
            io.emit('count', {count: io.engine.clientsCount})
        });
    });
}

const socket = {start: start};
export default socket;