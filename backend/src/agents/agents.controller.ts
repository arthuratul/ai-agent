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
    let summary = '';

    if (chatHistory?.chatMessage && chatHistory.chatMessage.length > 10) {
      summary = await this.agentsService.createSummary();
    }

    // pull only the last 5 messages from chat_message if there are more than 15 messages
    if (chatHistory && chatHistory.chatMessage.length > 10) {
      chatHistory.chatMessage = chatHistory.chatMessage.slice(-5);
    }

    const response = await this.agentsService.getOpenAIResponse(
      chatHistory?.chatMessage || [],
      summary,
    );

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
