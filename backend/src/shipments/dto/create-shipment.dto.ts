import { IsString, IsNumber, IsOptional, IsDateString, IsUUID } from 'class-validator';

export class CreateShipmentDto {
  @IsString()
  origin: string;

  @IsString()
  destination: string;

  @IsNumber()
  weight: number;

  @IsOptional()
  @IsNumber()
  length?: number;

  @IsOptional()
  @IsNumber()
  width?: number;

  @IsOptional()
  @IsNumber()
  height?: number;

  @IsOptional()
  @IsString()
  description?: string;

  @IsUUID()
  customerId: string;

  @IsOptional()
  @IsDateString()
  estimatedDate?: string;
}
