import { Injectable } from '@nestjs/common';
import { CreateMobileDeviceDto } from './dto/create-mobile-devices.dto';
import { UpdateMobileDeviceDto } from './dto/update-mobile-devices.dto';

@Injectable()
export class MobileDevicesService {

  create(createMobileDeviceDto: CreateMobileDeviceDto) {
    return 'This action adds a new mobile-devices';
  }

  findAll() {
    return `This action returns all mobile-devices`;
  }

  findOne(id: number) {
    return `This action returns a #${id} mobile-devices`;
  }

  update(id: number, updateMobileDeviceDto: UpdateMobileDeviceDto) {
    return `This action updates a #${id} mobile-devices`;
  }

  remove(id: number) {
    return `This action removes a #${id} mobile-devices`;
  }
}
