// ---------------------------------------------------------------------------
// PAYMENT SERVICE
// Commission calculation and payment intent creation.
// Provider TBD — stubbed with a generic interface that works with
// Razorpay, Stripe, or any other gateway.
// ---------------------------------------------------------------------------

import { Booking } from '../../types';
import { delay } from '../gateway/apiClient';

const DEFAULT_COMMISSION_RATE = 0.10; // 10% platform fee

export interface CommissionBreakdown {
  price: number;
  commission: number;
  total: number;
}

export interface PaymentIntent {
  intentId: string;
  amount: number;
  currency: string;
  status: 'created' | 'captured' | 'failed';
}

/**
 * Calculate platform commission for a booking.
 */
export function calculateCommission(
  price: number,
  rate: number = DEFAULT_COMMISSION_RATE,
): CommissionBreakdown {
  const commission = Math.round(price * rate);
  return {
    price,
    commission,
    total: price + commission,
  };
}

/**
 * Create a payment intent for a booking.
 * TODO: Replace with real payment gateway integration:
 *   - Razorpay: POST /api/payments/razorpay/order
 *   - Stripe:   POST /api/payments/stripe/intent
 */
export async function createPaymentIntent(
  booking: Booking,
): Promise<PaymentIntent> {
  const intent: PaymentIntent = {
    intentId: `pay_${Date.now()}_${booking.id}`,
    amount: booking.total,
    currency: 'INR',
    status: 'created',
  };
  return delay(intent);
}

/**
 * Confirm / capture a payment after the user completes checkout.
 * TODO: POST /api/payments/capture { intentId }
 */
export async function capturePayment(
  intentId: string,
): Promise<PaymentIntent> {
  return delay({
    intentId,
    amount: 0, // filled by backend
    currency: 'INR',
    status: 'captured',
  });
}
