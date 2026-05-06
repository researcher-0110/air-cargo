import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DashboardService {
  constructor(private prisma: PrismaService) {}

  async getStats() {
    const [
      totalShipments,
      activeShipments,
      deliveredShipments,
      totalCustomers,
    ] = await Promise.all([
      this.prisma.shipment.count(),
      this.prisma.shipment.count({
        where: { status: { notIn: ['DELIVERED'] } },
      }),
      this.prisma.shipment.count({
        where: { status: 'DELIVERED' },
      }),
      this.prisma.customer.count(),
    ]);

    const statusBreakdown = await this.prisma.shipment.groupBy({
      by: ['status'],
      _count: { status: true },
    });

    return {
      totalShipments,
      activeShipments,
      deliveredShipments,
      totalCustomers,
      statusBreakdown: statusBreakdown.map((s) => ({
        status: s.status,
        count: s._count.status,
      })),
    };
  }

  async getRecentActivity() {
    const recentShipments = await this.prisma.shipment.findMany({
      take: 10,
      orderBy: { updatedAt: 'desc' },
      include: { customer: { select: { name: true, company: true } } },
    });

    const recentUpdates = await this.prisma.statusUpdate.findMany({
      take: 10,
      orderBy: { timestamp: 'desc' },
      include: {
        shipment: { select: { awbNumber: true, origin: true, destination: true } },
      },
    });

    return { recentShipments, recentUpdates };
  }
}
