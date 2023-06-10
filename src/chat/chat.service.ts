import {Injectable} from '@nestjs/common';
import {InjectModel} from "@nestjs/mongoose";
import {Model} from "mongoose";
import {Chat, chatDocument} from "../schemas/chat.schema";
import {userChatDto} from "../dto/create-user.dto";
import {ObjectId} from "bson";

@Injectable()
export class ChatService {
    constructor(@InjectModel(Chat.name) private chatModel:Model<chatDocument>) {
    }

    async createChat(chats){
        const chat=await this.chatModel.create(chats)
        return chat.save()
    }

    async findChats(userId){
        if (ObjectId.isValid(userId)){
            return this.chatModel.find({"users._id": new ObjectId(userId)});
        } else {
            console.log(userId,"Неккоректный userid")
        }

    }

    async findAnotherChat(_id:string,another_id:string){
        return this.chatModel.find({
            $and: [{
                "users._id": new ObjectId(_id)
            }, {
                "users._id": new ObjectId(another_id)
            }]
        })
    }

    async addMessage(chatid:string,message:any){
       return this.chatModel.findOneAndUpdate({ _id: chatid },
           { $push: { messages: message } }
       )
    }
}
