import { MessageBody, OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer, WsResponse } from "@nestjs/websockets";
import { Observable, from, map } from "rxjs";
import { Server } from 'socket.io';
import * as jwt from 'jsonwebtoken'
import * as dotenv from "dotenv";
import { UsersService } from "src/users/users.service";
import { ChatService } from "src/chat/chat.service";
import { Chat } from "src/schemas/chat.schema";
dotenv.config()

@WebSocketGateway(3004,{
  cors: {
    origin: '*',
  },
})
export class AppGeteway implements OnGatewayConnection,OnGatewayDisconnect{
  constructor(private userService:UsersService,private chatService:ChatService){
  }
  handleDisconnect(client: any) {
    this.userService.userOnline(this.getUserIdASToken(client.handshake.query.token),false)
  }


  async handleConnection(client: any, ...args: any[]) {
    const userid=this.getUserIdASToken(client.handshake.query.token)
    if(userid){
      await this.userService.userOnline(userid,true)
      const users=await this.userService.getAllUsers(userid)
      this.server.emit("users",users)
      const chat = await this.chatService.findChats(userid)
      if(chat){
        this.server.emit("chats",chat)
      }
      
    }else{
      client.disconnect()
    }
  }
  getUserIdASToken(token:string):string{
    const tokenWithoutBearer = token.replace('Bearer ', '');
    try {
        const decodedToken: any = jwt.verify(tokenWithoutBearer, process.env.DB_SECRET_KEY);
        return decodedToken.userId;
    } catch (error) {
        console.log('Ошибка при расшифровке токена:', error);
        return null;
    }

}

  @WebSocketServer()
  server: Server;

  @SubscribeMessage('users')
  async getUsers(client:any){
    return await this.userService.getAllUsers(this.getUserIdASToken(client.handshake.query.token))
  }

  @SubscribeMessage('chats')
  async getChats(client:any){
    const userid=this.getUserIdASToken(client.handshake.query.token)
    if(userid){
      const chat = await this.chatService.findChats(userid)
      return chat
    }
    
  }

}