import {Module} from "@nestjs/common";
import {MongooseModule} from "@nestjs/mongoose";
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ChatModule } from './chat/chat.module';
import { FilesModule } from './files/files.module';
import {ServeStaticModule} from "@nestjs/serve-static";
import { AppGeteway } from './app/app.gateway';
import * as path from "path";


@Module({
    imports:[MongooseModule.forRoot('mongodb://127.0.0.1:27017/rshakh'),UsersModule,
        ServeStaticModule.forRoot({
            rootPath:path.resolve(__dirname,"static")
        })

        ,AuthModule, ChatModule, FilesModule],
    controllers: [],
    providers: [AppGeteway],
})
export class AppModule {
}