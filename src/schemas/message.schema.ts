import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { User, userDocument } from './user.schema';
import { ApiProperty } from '@nestjs/swagger';

export type MessageDocument = Message & Document;

@Schema()
export class Message {
  @Prop()
  chatId: string;
  @Prop({type:User})
  user:userDocument
  @Prop()
  message:string
  @Prop()
  data:string
  @Prop()
  files:[]
}

export const MessageSchema = SchemaFactory.createForClass(Message);
