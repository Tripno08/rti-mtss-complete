import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { ReferralsService } from './referrals.service';
import { CreateReferralDto } from './dto/create-referral.dto';
import { UpdateReferralDto } from './dto/update-referral.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('referrals')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('referrals')
export class ReferralsController {
  constructor(private readonly referralsService: ReferralsService) {}

  @Post()
  create(@Body() createReferralDto: CreateReferralDto, @Request() req) {
    return this.referralsService.create(createReferralDto, req.user.id);
  }

  @Get()
  findAll(@Request() req) {
    return this.referralsService.findAll(req.user.id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.referralsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateReferralDto: UpdateReferralDto) {
    return this.referralsService.update(id, updateReferralDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.referralsService.remove(id);
  }
} 