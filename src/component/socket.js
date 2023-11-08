import { Socket, io } from "socket.io-client"


export default class ChatIo {
    socket: Socket;
    constructor(url, user) {
        this.socket = io(url, { query: { user: JSON.stringify(user) } })

        return this;
    }
}