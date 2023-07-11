import {Prop, Schema, SchemaFactory} from '@nestjs/mongoose';
import {HydratedDocument} from 'mongoose';


export type chatDocument = HydratedDocument<Chat>;

@Schema()
export class Chat {
    @Prop({required:true})
  users: [];
}

export const ChatSchema = SchemaFactory.createForClass(Chat);