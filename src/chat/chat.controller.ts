import {Body, Controller, Get, Param, Post, UseGuards} from '@nestjs/common';
import {ChatService} from "./chat.service";
import {userChatDto} from "../dto/create-user.dto";
import {JwtAuthGuard} from "../auth/jwt-auth.guard";
import {MessageBody, SubscribeMessage, WebSocketGateway} from "@nestjs/websockets";

@Controller('api/chat')
export class ChatController {
    constructor(private chatService: ChatService) {
    }

    @Post("/create")
    createChat(@Body() chat:userChatDto){
       return  this.chatService.createChat(chat)
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
