const {nanoid} = require('nanoid');

let sockets = {};

function manageSocket(socket)
{
    const id = nanoid();
    sockets[id] = socket;
    socket.on('close', () =>
    {
        delete sockets[id];
    });
}

module.exports = {manageSocket};
