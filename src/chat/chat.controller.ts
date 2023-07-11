import {Body, Controller, Get, Param, Post, UseGuards} from '@nestjs/common';
import {ChatService} from "./chat.service";
import {JwtAuthGuard} from "../auth/jwt-auth.guard";
import {MessageBody, SubscribeMessage, WebSocketGateway} from "@nestjs/websockets";
import * as jwt from "jsonwebtoken";
import * as dotenv from "dotenv";
dotenv.config();
@Controller('api/chat')
export class ChatController {
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
    constructor(private chatService: ChatService) {
    }

    @Post("/create")
    async createChat(@Body() id){
       return  await this.chatService.createChat(id)
    }
    @UseGuards(JwtAuthGuard)
    @Get("/:id")
    getChats(@Param("id") id){

        return this.chatService.findChats(id)
    }
    @Get("/")
    isChat(){
        return "is chat"
    }
}
