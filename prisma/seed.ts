import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const product1 = await prisma.product.create({
    data: {
      product_name: "Product A",
      description: "This is Product A",
    },
  });

  const product2 = await prisma.product.create({
    data: {
      product_name: "Product B",
      description: "This is Product B",
    },
  });

  const customer1 = await prisma.customer.create({
    data: {
      customer_name: "Customer 1",
      currency: "USD",
    },
  });

  const customer2 = await prisma.customer.create({
    data: {
      customer_name: "Customer 2",
      currency: "SGD",
    },
  });

  const pricing1 = await prisma.pricing.create({
    data: {
      product_id: product1.product_id,
      customer_id: customer1.customer_id,
      price: 100.50,
      effective_date: new Date('2023-01-01T00:00:00Z'),
    },
  });

  const pricing2 = await prisma.pricing.create({
    data: {
      product_id: product2.product_id,
      customer_id: customer2.customer_id,
      price: 200.75,
      effective_date: new Date('2023-05-01T00:00:00Z'),
    },
  });

  // Create price history
  await prisma.priceHistory.createMany({
    data: [
        {
        pricing_id: pricing1.pricing_id,
        previous_price: 0,
        updated_price: 95,
        update_timestamp: new Date('2023-01-01T00:00:00Z'),
      },
      {
        pricing_id: pricing1.pricing_id,
        previous_price: 95.00,
        updated_price: 100.50,
        update_timestamp: new Date('2023-01-07T00:00:00Z'),
      },
        {
        pricing_id: pricing2.pricing_id,
        previous_price: 0,
        updated_price: 195,
        update_timestamp: new Date('2023-05-01T00:00:00Z'),
      },
      {
        pricing_id: pricing2.pricing_id,
        previous_price: 195.00,
        updated_price: 200.75,
        update_timestamp: new Date('2023-05-01T00:00:00Z'),
      },
    ],
  });
}

main()
  .then(() => {
    console.log("Seeding finished.");
  })
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
