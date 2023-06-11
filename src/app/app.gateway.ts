import {
  MessageBody, OnGatewayConnection, OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsResponse
} from '@nestjs/websockets';
import {Server} from "socket.io"
import {UsersService} from "../users/users.service";
import {ChatService} from "../chat/chat.service";
import * as jwt from "jsonwebtoken";
import * as dotenv from "dotenv";
dotenv.config()
@WebSocketGateway(3002,{ cors: '*' })

export class AppGateway implements OnGatewayDisconnect,OnGatewayConnection{
  getUserIdASToken(token:string):string{
    const tokenWithoutBearer = token.replace('Bearer ', '');
    try {
      const decodedToken: any = jwt.verify(tokenWithoutBearer, process.env.DB_SECRET_KEY);
      if (decodedToken){
        return decodedToken.userId;
      }
    } catch (error) {
      console.log('Ошибка при расшифровке токена:');
      return null;
    }

  }
  constructor(private userService:UsersService,private chatsService:ChatService) {
  }
  @WebSocketServer()
  server: Server;
 /* async handleConnection(client: any, ...args) {
    const queryParams = client.handshake.query;
    if (queryParams._id){
      await this.userService.userOnline(queryParams._id,true)
      const roomId = queryParams._id; // Идентификатор комнаты
      client.join(roomId)
    }*/
  async handleConnection(client: any, ...args) {
    const queryParams = client.handshake.query
    const token = queryParams.token
    try {
      if (!token) {
        console.log('Missing token')
      }

      const decodedToken:string = this.getUserIdASToken(token);

      if (!decodedToken) {
        client.disconnect(true)
      }
      const roomId = decodedToken;
      client.join(roomId);
    } catch (error) {
      console.log('Ошибка при подключении:', error);
      // Отключите соединение, так как токен отсутствует или недействителен
      client.disconnect(true);
    }
  }


  handleDisconnect(client: any): any {
    const token = client.handshake.query.token;
    if (token){
      this.userService.userOnline(this.getUserIdASToken(token),false)
    }

  }

@SubscribeMessage("getChats")
async getData(client:any,data:any){
  const token = client.handshake.query.token;
  if (token){
    const roomId = this.getUserIdASToken(token);
    const chats = await this.chatsService.findChats(this.getUserIdASToken(token))
    if (!(chats?.length===0)){
      this.server.to(roomId).emit(roomId,{
        chats:chats,
      })
      const chatRoomIds = chats?.map((chat: any) => {
        const chatRoomId = chat?._id.toString(); // Создание комнаты для каждого chat._id
        client.join(chatRoomId);
      })
    }
  }


}

@SubscribeMessage("createChat")
async CreateChat(client:any,data:any){

}
  @SubscribeMessage('chats')
  async getChats(client:any,data:any){
    const token = client.handshake.query.token;
    if (token){
      let roomid=""
      const user:any=await this.userService.findUser(this.getUserIdASToken(token))
      const anotherUser= await this.userService.findUser(data.another_id)
      const commonChat= await this.chatsService.findAnotherChat(this.getUserIdASToken(token),anotherUser._id.toString())
      if (!(commonChat.length===0)){
        commonChat.map(el=>{
          client.join(el._id.toString())
          this.server.to(el._id.toString())
          this.server.emit(el._id.toString())
        })

      } else {
        const createChat= await this.chatsService.createChat(
            {
              users:[user,anotherUser]
            }
        )
        const userChats = await this.chatsService.findChats(this.getUserIdASToken(token))
        const anotherChats = await this.chatsService.findChats(anotherUser._id.toString())
        this.server.to(createChat._id.toString())
        this.server.emit(this.getUserIdASToken(token),{chats:userChats})
        this.server.emit(anotherUser._id.toString(),{chats:anotherChats})
      }
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
