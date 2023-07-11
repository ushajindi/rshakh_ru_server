import * as process from "process";
import *as fs from "fs"
import {NestFactory} from "@nestjs/core";
import {AppModule} from "./app.module";
import {DocumentBuilder, SwaggerModule} from "@nestjs/swagger";
import * as dotenv from 'dotenv';
import { appendFile } from "fs";
import { SocketIOAdapter } from "./socket.io.adapter";
async function start() {
    dotenv.config();
    const PORT = process.env.DB_PORT || 3001
    const app = await NestFactory.create(AppModule,{
        httpsOptions:{
            key: fs.readFileSync('/etc/letsencrypt/live/rshakh.ru/privkey.pem'),
            cert: fs.readFileSync('/etc/letsencrypt/live/rshakh.ru/fullchain.pem'),
        }
    })
    app.enableCors()
    app.useWebSocketAdapter(new SocketIOAdapter(app));

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
