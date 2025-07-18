import { Injectable } from '@nestjs/common';
import { CreateAgentDto } from './dto/create-agent.dto';
import { UpdateAgentDto } from './dto/update-agent.dto';
import OpenAI from 'openai';

@Injectable()
export class AgentsService {
  async getOpenAIResponse(message: string): Promise<string> {

    console.log(process.env.OPENAI_API_KEY);
   const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
   });

   const response = await client.responses.create({
    model: 'gpt-4o-mini',
    input: message,
    max_output_tokens: 100,
   })

   return response.output_text;
  }
}
