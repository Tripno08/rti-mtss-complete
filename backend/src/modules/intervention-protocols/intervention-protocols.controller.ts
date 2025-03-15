import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { InterventionProtocolsService } from './intervention-protocols.service';
import { CreateProtocolDto } from './dto/create-protocol.dto';
import { UpdateProtocolDto } from './dto/update-protocol.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '@prisma/client';

@Controller('intervention-protocols')
@UseGuards(JwtAuthGuard, RolesGuard)
export class InterventionProtocolsController {
  constructor(
    private readonly interventionProtocolsService: InterventionProtocolsService,
  ) {}

  @Post()
  @Roles(UserRole.ADMIN, UserRole.SPECIALIST)
  create(@Body() createProtocolDto: CreateProtocolDto) {
    return this.interventionProtocolsService.create(createProtocolDto);
  }

  @Get()
  findAll() {
    return this.interventionProtocolsService.findAll();
  }

  @Get('base-intervention/:id')
  findByBaseIntervention(@Param('id') id: string) {
    return this.interventionProtocolsService.findByBaseIntervention(id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.interventionProtocolsService.findOne(id);
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN, UserRole.SPECIALIST)
  update(
    @Param('id') id: string,
    @Body() updateProtocolDto: UpdateProtocolDto,
  ) {
    return this.interventionProtocolsService.update(id, updateProtocolDto);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN, UserRole.SPECIALIST)
  remove(@Param('id') id: string) {
    return this.interventionProtocolsService.remove(id);
  }

  @Post(':id/duplicate')
  @Roles(UserRole.ADMIN, UserRole.SPECIALIST)
  duplicate(@Param('id') id: string, @Query('newName') newName: string) {
    return this.interventionProtocolsService.duplicateProtocol(id, newName || '');
  }
} 