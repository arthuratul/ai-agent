import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Chat, ChatDocument } from './schemas/chat.schema';
import OpenAI from 'openai';
import { encodeChat } from 'gpt-tokenizer';

type ChatMessage = {
  role: 'user' | 'assistant' | 'system';
  content: string;
};

@Injectable()
export class AgentsService {
  constructor(@InjectModel(Chat.name) private chatModel: Model<Chat>) {}

  async getOpenAIResponse(
    chatMessage: ChatMessage[],
    chatSummary: string,
  ): Promise<{
    role: string;
    content: string;
  }> {
    const client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const response = await client.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: `Here is the conversation so far: ${chatSummary}`,
        },
        ...chatMessage,
      ],
    });

    console.log(response.choices[0].message);

    return {
      role: response.choices[0].message.role,
      content: response.choices[0].message.content || '',
    };
  }

  async summarizeChatHistory(
    chatMessage: ChatMessage[],
    previousSummary: string,
  ) {
    const client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const messages: ChatMessage[] = [
      {
        role: 'system' as const,
        content: `Here is the conversation so far: ${previousSummary}. Summarize the following new messages:`,
      },
      ...chatMessage,
    ];

    const tokens = encodeChat(messages, 'gpt-4o-mini');
    console.log('total tokens:', tokens.length);

    const isWithinLimit = tokens.length <= 4000;

    if (!isWithinLimit) {
      throw new Error('Token limit exceeded');
    }

    const response = await client.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: `You are a helpful summarizer. Read the folowing full conversation and return a concise summary of the conversation.`,
        },
        {
          role: 'user',
          content: JSON.stringify(messages),
        },
      ],
    });

    return response.choices[0].message.content || '';
  }

  // this function will push another message to the chat_message
  async updateChatHistory(newMessage: { role: string; content: string }) {
    try {
      // Find the single chat document or create one if it doesn't exist
      let chat = await this.chatModel.findOne();
      if (!chat) {
        // Create new chat document if none exists
        chat = await this.chatModel.create({
          chatMessage: [newMessage],
          chatSummary: '',
        });
      } else {
        // Use $push to add message to the end of the array
        await this.chatModel.updateOne(
          { _id: chat._id },
          { $push: { chatMessage: newMessage } },
        );
        // Fetch the updated document
        chat = await this.chatModel.findById(chat._id);
      }
      return chat;
    } catch (error) {
      console.error('Error in updateChatHistory:', error);
      throw error;
    }
  }

  async getChatHistory(): Promise<ChatDocument | null> {
    return await this.chatModel.findOne();
  }

  async createSummary() {
    const chatHistory: ChatDocument | null = await this.getChatHistory();
    if (!chatHistory) {
      throw new Error('No chat history found');
    }

    const previousSummary = chatHistory.chatSummary || '';
    const summary = await this.summarizeChatHistory(
      chatHistory.chatMessage,
      previousSummary,
    );
    await this.chatModel.updateOne(
      { _id: chatHistory._id },
      { $set: { chatSummary: summary } },
    );
    return summary;
  }

  async createNewChat() {
    try {
      // Delete all existing chat documents
      await this.chatModel.deleteMany({});
      // Create a new empty chat document
      const newChat = await this.chatModel.create({
        chatMessage: [],
        chatSummary: '',
      });
      return {
        message: 'New chat created successfully',
        chatId: newChat._id,
      };
    } catch (error) {
      console.error('Error in createNewChat:', error);
      throw error;
    }
  }
}
