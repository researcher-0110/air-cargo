import { PartialType } from '@nestjs/mapped-types';
import { IsEnum, IsOptional } from 'class-validator';
import { CreateShipmentDto } from './create-shipment.dto';

enum ShipmentStatus {
  BOOKED = 'BOOKED',
  ACCEPTED = 'ACCEPTED',
  IN_TRANSIT = 'IN_TRANSIT',
  ARRIVED = 'ARRIVED',
  DELIVERED = 'DELIVERED',
}

export class UpdateShipmentDto extends PartialType(CreateShipmentDto) {
  @IsOptional()
  @IsEnum(ShipmentStatus)
  status?: ShipmentStatus;
}
