import {Injectable} from '@nestjs/common';
import {User, userDocument} from "../schemas/user.schema";
import {InjectModel} from "@nestjs/mongoose";
import {Model, Schema} from "mongoose";
import {UserDto} from "../dto/create-user.dto";
import {FilesService} from "../files/files.service";
import { ObjectId } from 'bson';

@Injectable()
export class UsersService {
    constructor(@InjectModel(User.name) private userModel: Model<userDocument>, private filesService: FilesService) {
    }
    async createUser(user: UserDto): Promise<User> {
        const newUser = new this.userModel(user)
        return newUser.save()
    }

    async findUser(_id:string) {
       return this.userModel.findById({_id})
    }
    async findEmail(email:string){
        const e=await this.userModel.find({email})
        if(e.length != 0){
            return false
        } else return true
    }

    async getAllUsersNoMe(_id:string) {
        return this.userModel.find({_id: { $ne: _id }}).select("-password")
    }
    async getAllUsers(){
        return this.userModel.find({}).select("-password")
    }

    async getByEmail(email: string) {

        return this.userModel.findOne({"email": email})
    }

    async updateUserAvatar(_id: any,image): Promise<any> {
        const fileName= await this.filesService.createFile(image)
        if (ObjectId.isValid(_id)) {
            await this.userModel.updateOne({ "_id": new ObjectId(_id) }, { $set: { "avaimg": fileName } });
            return await this.userModel.findById(_id)
        } else {
            return  new Error("Invalid _id"); // Обрабатывайте случай некорректного _id
        }
    }

    async userOnline(_id:string,online:boolean){
        if (ObjectId.isValid(_id)) {
         return this.userModel.updateOne({"_id":new ObjectId(_id)},{$set:{"online":online}})
    } else {
            return  new Error("Invalid _id"); // Обрабатывайте случай некорректного _id
        }
    }

}
