import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateShipmentDto } from './dto/create-shipment.dto';
import { UpdateShipmentDto } from './dto/update-shipment.dto';
import { UpdateStatusDto } from './dto/update-status.dto';

@Injectable()
export class ShipmentsService {
  constructor(private prisma: PrismaService) {}

  private generateAwbNumber(): string {
    const date = new Date();
    const dateStr = date.toISOString().slice(0, 10).replace(/-/g, '');
    const random = Math.floor(1000 + Math.random() * 9000);
    return `AWB-${dateStr}-${random}`;
  }

  async findAll(page = 1, limit = 10, status?: string, search?: string) {
    const skip = (page - 1) * limit;
    const where: any = {};

    if (status) {
      where.status = status;
    }
    if (search) {
      where.OR = [
        { awbNumber: { contains: search, mode: 'insensitive' } },
        { origin: { contains: search, mode: 'insensitive' } },
        { destination: { contains: search, mode: 'insensitive' } },
        { customer: { name: { contains: search, mode: 'insensitive' } } },
      ];
    }

    const [data, total] = await Promise.all([
      this.prisma.shipment.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: { customer: { select: { id: true, name: true, company: true } } },
      }),
      this.prisma.shipment.count({ where }),
    ]);

    return { data, meta: { total, page, limit, totalPages: Math.ceil(total / limit) } };
  }

  async findOne(id: string) {
    const shipment = await this.prisma.shipment.findUnique({
      where: { id },
      include: {
        customer: true,
        statusHistory: { orderBy: { timestamp: 'desc' } },
      },
    });
    if (!shipment) throw new NotFoundException('Shipment not found');
    return shipment;
  }

  async create(dto: CreateShipmentDto) {
    const awbNumber = this.generateAwbNumber();
    const shipment = await this.prisma.shipment.create({
      data: {
        ...dto,
        awbNumber,
        estimatedDate: dto.estimatedDate ? new Date(dto.estimatedDate) : null,
      },
      include: { customer: true },
    });

    await this.prisma.statusUpdate.create({
      data: {
        shipmentId: shipment.id,
        status: 'BOOKED',
        notes: 'Shipment created',
      },
    });

    return shipment;
  }

  async update(id: string, dto: UpdateShipmentDto) {
    await this.findOne(id);
    return this.prisma.shipment.update({
      where: { id },
      data: {
        ...dto,
        estimatedDate: dto.estimatedDate ? new Date(dto.estimatedDate) : undefined,
      },
      include: { customer: true },
    });
  }

  async updateStatus(id: string, dto: UpdateStatusDto) {
    const shipment = await this.findOne(id);

    await this.prisma.statusUpdate.create({
      data: {
        shipmentId: id,
        status: dto.status,
        location: dto.location,
        notes: dto.notes,
      },
    });

    const updateData: any = { status: dto.status };
    if (dto.status === 'DELIVERED') {
      updateData.deliveredDate = new Date();
    }

    return this.prisma.shipment.update({
      where: { id },
      data: updateData,
      include: {
        customer: true,
        statusHistory: { orderBy: { timestamp: 'desc' } },
      },
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.shipment.delete({ where: { id } });
  }
}
