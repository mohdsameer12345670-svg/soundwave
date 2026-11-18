import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

export async function POST(req: NextRequest) {
  const keySecret = process.env.RAZORPAY_KEY_SECRET;

  if (!keySecret) {
    return NextResponse.json({ error: 'Razorpay credentials not configured.' }, { status: 503 });
  }

  try {
    const body = await req.json();
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = body as {
      razorpay_order_id: string;
      razorpay_payment_id: string;
      razorpay_signature: string;
    };

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json({ error: 'Missing payment verification fields' }, { status: 400 });
    }

    // HMAC-SHA256 verification — this is the official Razorpay signature check
    const body_string = `${razorpay_order_id}|${razorpay_payment_id}`;
    const expectedSignature = crypto
      .createHmac('sha256', keySecret)
      .update(body_string)
      .digest('hex');

    const isValid = expectedSignature === razorpay_signature;

    if (!isValid) {
      return NextResponse.json({ error: 'Payment signature verification failed.' }, { status: 400 });
    }

    return NextResponse.json({ success: true, paymentId: razorpay_payment_id });
  } catch (err: unknown) {
    console.error('[Razorpay] verify-payment error:', err);
    return NextResponse.json({ error: 'Failed to verify payment' }, { status: 500 });
  }
}
