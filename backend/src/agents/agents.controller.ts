import { Controller, Post, Body, Get } from '@nestjs/common';
import { AgentsService } from './agents.service';
import { CreateAgentDto } from './dto/create-agent.dto';

@Controller('agents')
export class AgentsController {
  constructor(private readonly agentsService: AgentsService) {}

  @Post('runLLM')
  async runLLM(@Body() createAgentDto: CreateAgentDto) {
    
    await this.agentsService.updateChatHistory({
      role: 'user',
      content: createAgentDto.message,
    });

    const chatHistory = await this.agentsService.getChatHistory();

    const response = await this.agentsService.getOpenAIResponse(chatHistory?.chatMessage || []);

    await this.agentsService.updateChatHistory(response);

    return {
      message: response.content,
    };
  }


  @Get('chat-history')
  async getChatHistory() {
    return this.agentsService.getChatHistory();
  }
}
