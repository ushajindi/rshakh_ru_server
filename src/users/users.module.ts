import {forwardRef, Module} from '@nestjs/common';
import {MongooseModule} from "@nestjs/mongoose";
import {User, UserSchema} from "../schemas/user.schema";
import {UsersController} from "./users.controller";
import {UsersService} from "./users.service";
import {AuthModule} from "../auth/auth.module";
import {FilesModule} from "../files/files.module";
import { AppGeteway } from 'src/chat/app.gateway';

@Module({
    controllers:[UsersController],
    providers:[UsersService],
    imports:[MongooseModule.forFeature([{name:User.name,schema:UserSchema}]),
    forwardRef(
        ()=>AuthModule
    ),FilesModule
    ],
    exports:[UsersService]
})
export class UsersModule {
}
