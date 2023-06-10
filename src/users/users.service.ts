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

    async findUser(_id) {
       return this.userModel.findById({_id})
    }

    async findAllUsers() {
        return this.userModel.find({})
    }

    async getByEmail(email: string) {

        return this.userModel.findOne({"email": email})
    }

    async updateUserAvatar(_id: any,image): Promise<any> {
        const fileName= await this.filesService.createFile(image)
        if (ObjectId.isValid(_id)) {
            return this.userModel.updateOne({ "_id": new ObjectId(_id) }, { $set: { "avaimg": fileName } });
        } else {
            return  new Error("Invalid _id"); // Обрабатывайте случай некорректного _id
        }
    }

    async userOnline(_id,online){
        if (ObjectId.isValid(_id)) {
         return this.userModel.updateOne({"_id":new ObjectId(_id)},{$set:{"online":online}})
    } else {
            return  new Error("Invalid _id"); // Обрабатывайте случай некорректного _id
        }
    }

}
