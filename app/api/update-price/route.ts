import {NextResponse} from "next/server";
import prisma from "@/utils/db";



export async function POST(request:Request) {
    const body = await request.json()
    const pricing = await prisma.pricing.findFirst({
      where: {
        product_id: Number(body.productId),
        customer_id: Number(body.customerId),
      },
    });
    if (!pricing) {
      return NextResponse.json(
        { error: 'Pricing information not found for the given product and customer' },
        { status: 404 }
      );
    }

    if (pricing.price === body.price) {
        return NextResponse.json(
        { error: 'Price same as current price' },
        { status: 403 }
      );
    }
    await prisma.priceHistory.create({
        data: {
            pricing_id: pricing.pricing_id,
            previous_price: pricing.price,
            update_timestamp: new Date(),
            updated_price: body.price,
        }
    })
    const updatedPricing = await prisma.pricing.update({
        where: {
            pricing_id: pricing.pricing_id
        }, data: {
            price: body.price,
            effective_date: new Date()
        }
    })
    return NextResponse.json(updatedPricing)
}