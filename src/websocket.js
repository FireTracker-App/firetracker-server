const {nanoid} = require('nanoid');

class SocketManager
{
    constructor()
    {
        this.sockets = {};
    }
    
    manageSocket(socket)
    {
        const id = nanoid();
        this.sockets[id] = socket;
        socket.on('close', () =>
        {
            delete this.sockets[id];
        });
    }
    
    sendToAll(message)
    {
        const messageStr = typeof message === 'string' ? message : JSON.stringify(message);
        for(const id in this.sockets)
        {
            if(!this.sockets.hasOwnProperty(id))
            {
                continue;
            }
            const socket = this.sockets[id];
            socket.send(messageStr);
        }
    }
}

module.exports = new SocketManager();
