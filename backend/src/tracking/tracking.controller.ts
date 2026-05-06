import { Controller, Get, Param, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Public } from '../common/decorators/public.decorator';

@Controller('tracking')
export class TrackingController {
  constructor(private prisma: PrismaService) {}

  @Public()
  @Get(':awbNumber')
  async track(@Param('awbNumber') awbNumber: string) {
    const shipment = await this.prisma.shipment.findUnique({
      where: { awbNumber },
      select: {
        awbNumber: true,
        origin: true,
        destination: true,
        status: true,
        weight: true,
        bookedDate: true,
        estimatedDate: true,
        deliveredDate: true,
        customer: { select: { name: true, company: true } },
        statusHistory: { orderBy: { timestamp: 'asc' } },
      },
    });

    if (!shipment) {
      throw new NotFoundException('Shipment not found. Please check your AWB number.');
    }

    return shipment;
  }
}
