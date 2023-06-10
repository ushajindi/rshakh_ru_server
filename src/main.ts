import * as process from "process";
import {NestFactory} from "@nestjs/core";
import {AppModule} from "./app.module";
import {DocumentBuilder, SwaggerModule} from "@nestjs/swagger";
import {IoAdapter} from "@nestjs/platform-socket.io";
import * as http from "http";
import * as socketio from "socket.io"
async function start() {
    const PORT = process.env.PORT || 3001
    const app = await NestFactory.create(AppModule)

    const config = new DocumentBuilder()
        .setTitle('rshakh.ru API')
        .setDescription("Documentation API")
        .setVersion("1.0.0")
        .addTag("ushajindi")
        .build()
    const document=SwaggerModule.createDocument(app,config)
    SwaggerModule.setup('/api/docs',app,document)

    await app.listen(PORT, () => console.log(`server started ${PORT}`))
}

start()
