import { Injectable } from '@nestjs/common';
import { CreateAgentDto } from './dto/create-agent.dto';
import { UpdateAgentDto } from './dto/update-agent.dto';

@Injectable()
export class AgentsService {
  create(createAgentDto: CreateAgentDto) {
    return 'This action adds a new agent';
  }

}
