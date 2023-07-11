import { IoAdapter } from '@nestjs/platform-socket.io';
import { ServerOptions } from 'socket.io';

export class SocketIOAdapter extends IoAdapter {
  createIOServer(port: number, options?: ServerOptions): any {
    options.allowEIO3 = true; // Разрешить использование Socket.IO v3
    const server = super.createIOServer(port, options);
    // Дополнительные настройки сервера Socket.IO, если необходимо
    return server;
  }
}
