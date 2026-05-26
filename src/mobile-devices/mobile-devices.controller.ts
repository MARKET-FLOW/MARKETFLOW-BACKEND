import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { MobileDevicesService } from './mobile-devices.service';
import { CreateMobileDeviceDto } from './dto/create-mobile-devices.dto';
import { UpdateMobileDeviceDto } from './dto/update-mobile-devices.dto';

@Controller('mobile-devices')
export class MobileDevicesController {
  constructor(private readonly mobileDevicesService: MobileDevicesService) {}

  @Post()
  create(@Body() createMobileDeviceDto: CreateMobileDeviceDto) {
    return this.mobileDevicesService.create(createMobileDeviceDto);
  }

  @Get()
  findAll() {
    return this.mobileDevicesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.mobileDevicesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateMobileDeviceDto: UpdateMobileDeviceDto) {
    return this.mobileDevicesService.update(+id, updateMobileDeviceDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.mobileDevicesService.remove(+id);
  }
}
