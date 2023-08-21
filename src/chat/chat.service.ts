import {Injectable} from '@nestjs/common';
import {InjectModel} from "@nestjs/mongoose";
import {Model} from "mongoose";
import {Chat, chatDocument} from "../schemas/chat.schema";
import {ObjectId} from "bson";
import { Message, MessageDocument } from 'src/schemas/message.schema';
import { User, userDocument } from 'src/schemas/user.schema';
//import { AppGeteway } from 'src/app/app.gateway';

@Injectable()
export class ChatService {
    constructor(
        @InjectModel(Chat.name) private chatModel: Model<chatDocument>,
        @InjectModel(Message.name) private messageModel: Model<MessageDocument>,
        @InjectModel(User.name) private userModel: Model<userDocument>,
        //private AppGeteway:AppGeteway,
      ) {}

    async createChat(ids){
        let users=[]
        await Promise.all(
            ids.map(async (id) => {
              const user = await this.userModel.findById(id).select('-password');
              if (user) {
                users.push(user);
              }
            })
          ); 
          const chat=await this.chatModel.create({users:users})
          if(chat.save()){
            return chat
          }
       return false
    }
    async addMessage(date:string,userid,chatId,message:string,files:[]|null){
           const addmessage =await this.messageModel.create({
                chatId,
                user:userid,
                message,
                date,
                files
            })
            return addmessage.save()
    }

    async findMessage(id){
      return await this.messageModel.find({chatId:id})
    }

    async findChats(userId){
        if (ObjectId.isValid(userId)){
            const chats = await this.chatModel.find({"users._id":new ObjectId(`${userId}`)});
            const filteredChats = chats.map((el) => {
                const filteredUsers = el.users.filter((user:any) => user._id.toString() !== userId);
                return { ...el.toObject(), users: filteredUsers[0] };
              });
              return filteredChats;
              
            return chats;
        } else {
            console.log(userId,"Неккоректный userid")
        }

    }

    async findAnotherChat(_id:string,another_id:string){
        return await this.chatModel.find({
            $and: [{
                "users._id": new ObjectId(_id)
            }, {
                "users._id": new ObjectId(another_id)
            }]
        })
    }
}
