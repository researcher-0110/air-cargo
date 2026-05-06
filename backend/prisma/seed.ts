import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  // Create admin user
  const hashedPassword = await bcrypt.hash('admin123', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@aircargo.com' },
    update: {},
    create: {
      name: 'Admin User',
      email: 'admin@aircargo.com',
      password: hashedPassword,
    },
  });
  console.log('Created admin user:', admin.email);

  // Create customers
  const customers = await Promise.all([
    prisma.customer.upsert({
      where: { email: 'john@globalfreight.com' },
      update: {},
      create: {
        name: 'John Smith',
        email: 'john@globalfreight.com',
        phone: '+1-555-0101',
        company: 'Global Freight Solutions',
        address: '123 Logistics Ave, New York, NY 10001',
      },
    }),
    prisma.customer.upsert({
      where: { email: 'maria@euroexpress.de' },
      update: {},
      create: {
        name: 'Maria Weber',
        email: 'maria@euroexpress.de',
        phone: '+49-30-12345678',
        company: 'Euro Express GmbH',
        address: 'Friedrichstr. 45, Berlin, Germany',
      },
    }),
    prisma.customer.upsert({
      where: { email: 'tanaka@nipponair.jp' },
      update: {},
      create: {
        name: 'Tanaka Hiroshi',
        email: 'tanaka@nipponair.jp',
        phone: '+81-3-1234-5678',
        company: 'Nippon Air Logistics',
        address: '2-4-1 Haneda, Tokyo, Japan',
      },
    }),
    prisma.customer.upsert({
      where: { email: 'ahmed@dubailogistics.ae' },
      update: {},
      create: {
        name: 'Ahmed Al-Rashid',
        email: 'ahmed@dubailogistics.ae',
        phone: '+971-4-123-4567',
        company: 'Dubai Logistics Corp',
        address: 'Trade Center, Dubai, UAE',
      },
    }),
    prisma.customer.upsert({
      where: { email: 'sarah@pacificship.com.au' },
      update: {},
      create: {
        name: 'Sarah Collins',
        email: 'sarah@pacificship.com.au',
        phone: '+61-2-9876-5432',
        company: 'Pacific Shipping Co.',
        address: '88 Harbor St, Sydney, Australia',
      },
    }),
  ]);
  console.log(`Created ${customers.length} customers`);

  // Create shipments
  const shipments = [
    { origin: 'New York (JFK)', destination: 'London (LHR)', weight: 250, status: 'DELIVERED' as const, customerId: customers[0].id, awb: 'AWB-20260501-1001' },
    { origin: 'Berlin (BER)', destination: 'Dubai (DXB)', weight: 180, status: 'IN_TRANSIT' as const, customerId: customers[1].id, awb: 'AWB-20260503-1002' },
    { origin: 'Tokyo (NRT)', destination: 'Los Angeles (LAX)', weight: 500, status: 'ACCEPTED' as const, customerId: customers[2].id, awb: 'AWB-20260505-1003' },
    { origin: 'Dubai (DXB)', destination: 'Singapore (SIN)', weight: 320, status: 'IN_TRANSIT' as const, customerId: customers[3].id, awb: 'AWB-20260504-1004' },
    { origin: 'Sydney (SYD)', destination: 'Hong Kong (HKG)', weight: 150, status: 'BOOKED' as const, customerId: customers[4].id, awb: 'AWB-20260507-1005' },
    { origin: 'London (LHR)', destination: 'New York (JFK)', weight: 420, status: 'ARRIVED' as const, customerId: customers[0].id, awb: 'AWB-20260502-1006' },
    { origin: 'Frankfurt (FRA)', destination: 'Tokyo (NRT)', weight: 275, status: 'IN_TRANSIT' as const, customerId: customers[1].id, awb: 'AWB-20260506-1007' },
    { origin: 'Singapore (SIN)', destination: 'Melbourne (MEL)', weight: 195, status: 'BOOKED' as const, customerId: customers[3].id, awb: 'AWB-20260507-1008' },
  ];

  for (const s of shipments) {
    const shipment = await prisma.shipment.upsert({
      where: { awbNumber: s.awb },
      update: {},
      create: {
        awbNumber: s.awb,
        origin: s.origin,
        destination: s.destination,
        weight: s.weight,
        status: s.status,
        customerId: s.customerId,
        description: `Cargo shipment from ${s.origin} to ${s.destination}`,
      },
    });

    // Add status history
    const statusFlow = ['BOOKED', 'ACCEPTED', 'IN_TRANSIT', 'ARRIVED', 'DELIVERED'];
    const currentIdx = statusFlow.indexOf(s.status);
    for (let i = 0; i <= currentIdx; i++) {
      await prisma.statusUpdate.create({
        data: {
          shipmentId: shipment.id,
          status: statusFlow[i] as any,
          location: s.origin.split(' ')[0],
          notes: `Status updated to ${statusFlow[i].replace('_', ' ')}`,
          timestamp: new Date(Date.now() - (currentIdx - i) * 86400000),
        },
      });
    }
  }
  console.log(`Created ${shipments.length} shipments with status history`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
