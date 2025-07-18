import { Controller, Post, Body } from '@nestjs/common';
import { AgentsService } from './agents.service';
import { CreateAgentDto } from './dto/create-agent.dto';

@Controller('agents')
export class AgentsController {
  constructor(private readonly agentsService: AgentsService) {}

  @Post('runLLM')
  async runLLM(@Body() createAgentDto: CreateAgentDto) {
    console.log(createAgentDto);
    const response  = await this.agentsService.getOpenAIResponse(createAgentDto.message);
    return {
      message: response,
    };
  }
}
