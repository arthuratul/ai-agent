import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateAgentDto } from './dto/create-agent.dto';
import { UpdateAgentDto } from './dto/update-agent.dto';
import { Chat } from './schemas/chat.schema';
import OpenAI from 'openai';

type ChatMessage = {
  role: 'user' | 'assistant' | 'system';
  content: string;
};

@Injectable()
export class AgentsService {
  constructor(@InjectModel(Chat.name) private chatModel: Model<Chat>) {}

  async getOpenAIResponse(chatMessage: ChatMessage[]): Promise<{
    role: string;
    content: string;
  }> {
   const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
   });

   const response = await client.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: chatMessage,
   })

   console.log(response.choices[0].message);

   return {
    role: response.choices[0].message.role,
    content: response.choices[0].message.content || '',
   }
  }

  // this function will push another message to the chat_message
  async updateChatHistory(newMessage: { role: string; content: string }) {
    try {
      console.log('updateChatHistory called with:', newMessage);
      
      // Find the single chat document or create one if it doesn't exist
      let chat = await this.chatModel.findOne();
      console.log('Existing chat found:', chat);
      
      if (!chat) {
        console.log('No chat found, creating new one...');
        // Create new chat document if none exists
        chat = await this.chatModel.create({
          chatMessage: [newMessage],
          chatSummary: ''
        });
        console.log('New chat created:', chat);
      } else {
        console.log('Chat found, pushing new message...');
        // Use $push to add message to the end of the array
        await this.chatModel.updateOne(
          { _id: chat._id },
          { $push: { chatMessage: newMessage } }
        );
        console.log('Chat updated with new message');
        // Fetch the updated document
        chat = await this.chatModel.findById(chat._id);
      }
      
      return chat;
    } catch (error) {
      console.error('Error in updateChatHistory:', error);
      throw error;
    }
  }

  async getChatHistory() {
    return await this.chatModel.findOne();
  }
}
