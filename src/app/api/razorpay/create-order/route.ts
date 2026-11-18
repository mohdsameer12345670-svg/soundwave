import { NextRequest, NextResponse } from 'next/server';
import Razorpay from 'razorpay';

export async function POST(req: NextRequest) {
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;

  if (!keyId || !keySecret) {
    return NextResponse.json(
      { error: 'Razorpay credentials not configured. Please add RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET to your .env.local file.' },
      { status: 503 }
    );
  }

  try {
    const body = await req.json();
    const { amount, currency = 'INR', receipt, notes } = body as {
      amount: number;
      currency?: string;
      receipt?: string;
      notes?: Record<string, string>;
    };

    if (!amount || amount <= 0) {
      return NextResponse.json({ error: 'Invalid amount' }, { status: 400 });
    }

    const razorpay = new Razorpay({ key_id: keyId, key_secret: keySecret });

    const order = await razorpay.orders.create({
      amount: Math.round(amount * 100), // paise
      currency,
      receipt: receipt || `rcpt_${Date.now()}`,
      notes: notes || {},
    });

    return NextResponse.json({ orderId: order.id, amount: order.amount, currency: order.currency });
  } catch (err: unknown) {
    console.error('[Razorpay] create-order error:', err);
    return NextResponse.json({ error: 'Failed to create Razorpay order' }, { status: 500 });
  }
}
