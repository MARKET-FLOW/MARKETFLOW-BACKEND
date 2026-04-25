import { PartialType } from '@nestjs/swagger';
import { CreateMobileDeviceDto } from './create-mobile-devices.dto';

export class UpdateMobileDeviceDto extends PartialType(CreateMobileDeviceDto) {}
