import {forwardRef, Module} from '@nestjs/common';
import {ChatService} from "./chat.service";
import {ChatController} from "./chat.controller";
import {MongooseModule} from "@nestjs/mongoose";
import {User, UserSchema} from "../schemas/user.schema";
import {Chat, ChatSchema} from "../schemas/chat.schema";
import {AuthModule} from "../auth/auth.module";
import {UsersModule} from "../users/users.module";

@Module({
  providers: [ChatService],
  controllers: [ChatController],
  imports:[MongooseModule.forFeature([{name:Chat.name,schema:ChatSchema}]),
    forwardRef(
        ()=>UsersModule
    ),
    forwardRef(
        ()=>AuthModule
    )],
  exports:[ChatService]
})
export class ChatModule {}
