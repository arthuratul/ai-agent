import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type ChatDocument = HydratedDocument<Chat>;

@Schema()
export class Chat {
  @Prop({ type: [Object], required: true })
  chatMessage: {
    role: 'user' | 'assistant' | 'system';
    content: string;
  }[];
  @Prop({ required: false, default: '' })
  chatSummary: string;
}

export const ChatSchema = SchemaFactory.createForClass(Chat);
