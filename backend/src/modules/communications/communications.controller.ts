import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { CommunicationsService } from './communications.service';
import { CreateCommunicationDto } from './dto/create-communication.dto';
import { UpdateCommunicationDto } from './dto/update-communication.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('communications')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('communications')
export class CommunicationsController {
  constructor(private readonly communicationsService: CommunicationsService) {}

  @Post()
  create(@Body() createCommunicationDto: CreateCommunicationDto, @Request() req) {
    return this.communicationsService.create(createCommunicationDto, req.user.id);
  }

  @Get()
  findAll(@Request() req) {
    return this.communicationsService.findAll(req.user.id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.communicationsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCommunicationDto: UpdateCommunicationDto) {
    return this.communicationsService.update(id, updateCommunicationDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.communicationsService.remove(id);
  }
} 