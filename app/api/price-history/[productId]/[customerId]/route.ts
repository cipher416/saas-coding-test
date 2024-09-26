import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(
  request: Request,
  { params }: { params: { productId: string; customerId: string } }
) {
  const { productId, customerId } = params;

  try {
    const pricing = await prisma.pricing.findFirst({
      where: {
        product_id: Number(productId),
        customer_id: Number(customerId),
      },
      include: {
          customer: true,
          PriceHistory: true,
      },
    });

    if (!pricing) {
      return NextResponse.json(
        { error: 'Pricing information not found for the given product and customer' },
        { status: 404 }
      );
    }

    const priceHistoryArray = pricing.PriceHistory.map((history) => ({
      price: history.updated_price,
      timestamp: history.update_timestamp,
    }));


    priceHistoryArray.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

    return NextResponse.json({
      product_id: pricing.product_id,
      customer_id: pricing.customer_id, currency: pricing.customer.currency,
      price_history: priceHistoryArray,
    });
  } catch (error) {
    console.error('Error fetching price history:', error);
    return NextResponse.json({ error: 'An error occurred while fetching price history' }, { status: 500 });
  }
}
