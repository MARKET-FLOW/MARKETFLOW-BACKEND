import { Module } from '@nestjs/common';
import { MobileDevicesService } from './mobile-devices.service';
import { MobileDevicesController } from './mobile-devices.controller';
import { MobileDevicesRepository } from './mobile-devices.repository';

@Module({
  controllers: [MobileDevicesController],
  providers: [MobileDevicesService, MobileDevicesRepository],
})
export class MobileDevicesModule {}
