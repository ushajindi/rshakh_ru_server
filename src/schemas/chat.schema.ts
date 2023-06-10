import {Prop, Schema, SchemaFactory} from '@nestjs/mongoose';
import {HydratedDocument} from 'mongoose';
import {ApiProperty} from "@nestjs/swagger";

export type chatDocument = HydratedDocument<Chat>;

@Schema()
export class Chat {
    @Prop()
    users: [
        username: string,
        _id: string,
        email: string,
        avaimg: string
    ]
    @Prop()
    messages: [
        user:{
            username: string,
            _id: string,
            email: string,
            avaimg: string
        },
        data: {
            data: string,
            time: string
        },
    message: string
,
    img: [
        src: string
    ]
]

}

export const ChatSchema = SchemaFactory.createForClass(Chat);