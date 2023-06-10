import {Prop, Schema, SchemaFactory} from '@nestjs/mongoose';
import {HydratedDocument} from 'mongoose';
import {ApiProperty} from "@nestjs/swagger";

export type userDocument = HydratedDocument<User>;

@Schema()
export class User {

    @ApiProperty({example: '1', description: 'Name'})
    @Prop({type: String})
    username: string;
    @ApiProperty({example: '2', description: 'Email'})
    @Prop({type: String, trim: true, index: true, unique: true, sparse: true})
    email: string

    @Prop()
    password: string;

    @Prop()
    avaimg: string;

    @Prop()
    online: boolean;


}

export const UserSchema = SchemaFactory.createForClass(User);