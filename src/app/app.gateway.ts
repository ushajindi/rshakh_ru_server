import {
  MessageBody, OnGatewayConnection, OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsResponse
} from '@nestjs/websockets';
import {Server} from "socket.io"
import {from, map, Observable} from "rxjs";
import {UsersService} from "../users/users.service";
import {UseGuards} from "@nestjs/common";
import {JwtAuthGuard} from "../auth/jwt-auth.guard";
import {ChatService} from "../chat/chat.service";


@WebSocketGateway(3002,{ cors: '*:*' })
export class AppGateway implements OnGatewayDisconnect,OnGatewayConnection{

  constructor(private userService:UsersService,private chatsService:ChatService) {
  }
  @WebSocketServer()
  server: Server;
  async handleConnection(client: any, ...args) {
    const queryParams = client.handshake.query;
    if (queryParams._id){
      await this.userService.userOnline(queryParams._id,true)
      const roomId = queryParams._id; // Идентификатор комнаты
      client.join(roomId)
    }


  }
  handleDisconnect(client: any): any {
    const queryParams = client.handshake.query;
    this.userService.userOnline(queryParams?._id,false)
  }

@SubscribeMessage("getChats")
async getData(client:any,data:any){
  const queryParams = client.handshake.query;
  console.log(queryParams._id)
  const roomId = queryParams._id;
  const chats = await this.chatsService.findChats(queryParams._id)
  if (!(chats?.length===0)){
    this.server.to(roomId).emit(roomId,{
      chats:chats,
    })
    const chatRoomIds = chats?.map((chat: any) => {
      const chatRoomId = chat?._id.toString(); // Создание комнаты для каждого chat._id
      client.join(chatRoomId);
      return chatRoomId;
    })
  }

}
  @SubscribeMessage('chats')
  async getChats(client:any,data:any){
    const queryParams = client.handshake.query;
    let roomid=""
    const user:any=await this.userService.findUser(queryParams._id)
    const anotherUser= await this.userService.findUser(data.another_id)
    const commonChat= await this.chatsService.findAnotherChat(queryParams._id,anotherUser._id.toString())
    if (!(commonChat.length===0)){
      commonChat.map(el=>roomid=el._id.toString())
      client.join(roomid)
      this.server.to(roomid)
      this.server.emit(roomid)
    } else {
      const createChat= await this.chatsService.createChat(
          {
            users:[user,anotherUser]
          }
      )
      const userChats = await this.chatsService.findChats(queryParams?._id)
      const anotherChats = await this.chatsService.findChats(anotherUser._id.toString())
      this.server.to(createChat._id.toString())
      this.server.emit(queryParams._id,{chats:userChats})
      this.server.emit(anotherUser._id.toString(),{chats:anotherChats})
    }
  }

  @SubscribeMessage('message')
  async userGet(@MessageBody() data:any) {
    const newMessage= await this.chatsService.addMessage(data.chatid,data.message)
    this.server.emit(data.chatid,{
      chatid:data.chatid,
      message:data.message
    })
  }

}
