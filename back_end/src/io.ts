import { Server } from 'socket.io';

export let io: Server;

export function setIO(_io: Server) {
  io = _io;
}
