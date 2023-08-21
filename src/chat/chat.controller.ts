import {Body, Controller, Get, HttpCode, Param, Post, UseGuards,HttpException,HttpStatus} from '@nestjs/common';
import {ChatService} from "./chat.service";
import {JwtAuthGuard} from "../auth/jwt-auth.guard";
import {MessageBody, SubscribeMessage, WebSocketGateway} from "@nestjs/websockets";
import * as jwt from "jsonwebtoken";
import * as dotenv from "dotenv";
import { isDeepStrictEqual } from 'util';
import { ExceptionsHandler } from '@nestjs/core/exceptions/exceptions-handler';
import { HttpErrorByCode } from '@nestjs/common/utils/http-error-by-code.util';
import { AppGeteway } from 'src/chat/app.gateway';
dotenv.config();

type UserChatType={
    _id:string,
    email:string,
    userName:string,
    avaImg:string
}
type createChatIds={
    userOne:UserChatType,
    userTwo:UserChatType
}
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
    constructor(private chatService: ChatService,private socket:AppGeteway) {
    }

    @Post("/create")
    async createChat(@Body() ids:UserChatType){
        const newChat=await this.chatService.createChat(ids)
        if(newChat){
           this.socket.newChat(newChat)
           return newChat
        } else return new HttpException('Forbidden', HttpStatus.FORBIDDEN);
        
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
