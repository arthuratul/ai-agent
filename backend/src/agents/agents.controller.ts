import { Controller, Post, Body } from '@nestjs/common';
import { AgentsService } from './agents.service';
import { CreateAgentDto } from './dto/create-agent.dto';

@Controller('agents')
export class AgentsController {
  constructor(private readonly agentsService: AgentsService) {}

  @Post()
  create(@Body() createAgentDto: CreateAgentDto) {
    console.log(createAgentDto);
    return {
      message: 'Agent is a work in progeress....',
    };
    return this.agentsService.create(createAgentDto);
  }
}
