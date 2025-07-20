import {Prop,  Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Schema as MongooseSchema } from "mongoose";

export type ChatDocument = HydratedDocument<Chat>;

@Schema()
export class Chat {
    @Prop({ type: MongooseSchema.Types.Mixed, required: true })
    chatMessage: [{
        role: 'user' | 'assistant' | 'system';
        content: string;
    }];
    @Prop({ required: false, default: '' })
    chatSummary: string;    
}

export const ChatSchema = SchemaFactory.createForClass(Chat);