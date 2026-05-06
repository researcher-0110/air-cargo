import { IsEnum, IsOptional, IsString } from 'class-validator';

enum ShipmentStatus {
  BOOKED = 'BOOKED',
  ACCEPTED = 'ACCEPTED',
  IN_TRANSIT = 'IN_TRANSIT',
  ARRIVED = 'ARRIVED',
  DELIVERED = 'DELIVERED',
}

export class UpdateStatusDto {
  @IsEnum(ShipmentStatus)
  status: ShipmentStatus;

  @IsOptional()
  @IsString()
  location?: string;

  @IsOptional()
  @IsString()
  notes?: string;
}
