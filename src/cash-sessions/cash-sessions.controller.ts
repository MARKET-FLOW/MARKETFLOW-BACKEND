import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CashSessionsService } from './cash-sessions.service';
import { CreateCashSessionDto } from './dto/create-cash-sessions.dto';
import { UpdateCashSessionDto } from './dto/update-cash-sessions.dto';

@Controller('cash-sessions')
export class CashSessionsController {
  constructor(private readonly cashSessionsService: CashSessionsService) {}

  @Post()
  create(@Body() createCashSessionDto: CreateCashSessionDto) {
    return this.cashSessionsService.create(createCashSessionDto);
  }

  @Get()
  findAll() {
    return this.cashSessionsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.cashSessionsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCashSessionDto: UpdateCashSessionDto) {
    return this.cashSessionsService.update(+id, updateCashSessionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.cashSessionsService.remove(+id);
  }
}
