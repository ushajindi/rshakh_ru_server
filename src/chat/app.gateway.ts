import { MessageBody, OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer, WsResponse } from "@nestjs/websockets";
import { Observable, from, map } from "rxjs";
import { Server } from 'socket.io';
import * as jwt from 'jsonwebtoken'
import * as dotenv from "dotenv";
import { UsersService } from "src/users/users.service";
import { ChatService } from "src/chat/chat.service";
import { Chat } from "src/schemas/chat.schema";
dotenv.config()
type usersType={
  _id:string,
  username:string,
  online:boolean,
  email:string
}
type chatsType={
  _id:string,
  users:usersType[]
}

@WebSocketGateway(3004,{
  cors: {
    origin: '*',
  },
})
export class AppGeteway implements OnGatewayConnection,OnGatewayDisconnect{
  constructor(private userService:UsersService,private chatService:ChatService){
  }
  async handleDisconnect(client: any) {
    this.userService.userOnline(this.getUserIdASToken(client.handshake.query.token),false)
    const user = await this.userService.getAllUsers()
    this.server.emit("users",user)

  }

async newChat(chat){
  chat.users.map((el:usersType)=>{
    this.server.emit(el._id,{
      chat:chat,
      action:"new"
    })
  })
}

  async handleConnection(client: any, ...args: any[]) {
    const userid=this.getUserIdASToken(client.handshake.query.token)
    if(userid){
      await this.userService.userOnline(userid,true)
      const users=await this.userService.getAllUsers()
      client.join(userid)
      this.server.emit("users",users)
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
    return await this.userService.getAllUsers()
  }
  @SubscribeMessage('msg')
async Message(@MessageBody() message: any) {
  this.server.socketsJoin(message.chatId);
  const newMessage = await this.chatService.addMessage(message.date, message.user, message.chatId, message.message, []);
  this.server.to(message.chatId).emit(message.chatId, {
    [message.chatId]:newMessage
  });
}

  @SubscribeMessage('getchats')
  async getChats(client: any) {
    const userid = this.getUserIdASToken(client.handshake.query.token);
    if (userid) {
      let messages = {};
      client.join(userid);
      const chat = await this.chatService.findChats(userid);
      if (chat.length != 0) {
        await Promise.all(chat.map(async (el) => {
          client.join(el._id);
          const message = await this.chatService.findMessage(el._id);
          if (message.length != 0) {
            if (messages[el._id]) {
              messages[el._id].push(message);
            } else {
              messages[el._id] = message;
            }
          }
        }));
  
        if (Object.keys(messages).length !== 0) {
          this.server.to(userid).emit(userid, {
            chat,
            messages,
            action:"all"
          });
        } else {
          this.server.to(userid).emit(userid, { chat,action:"all" });
        }
      }
    }
  }
  



}