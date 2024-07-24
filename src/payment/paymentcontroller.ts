import { Context } from "hono";
import {
  paymentsService,
  getpaymentService,
  createPaymentService,
  updatepaymentService,
  deletepaymentService
} from "./paymentservice";

// List Payments
export const listpayments = async (c: Context) => {
  try {
    const data = await paymentsService();
    if (!data || data.length === 0) {
      return c.text("Payment not found", 404);
    }
    return c.json(data, 200);
  } catch (error: any) {
    console.error("Error listing payments:", error);
    return c.json({ error: error?.message }, 500);
  }
};

// Get Payment by ID
export const getpayment = async (c: Context) => {
  const id = parseInt(c.req.param("id"));
  if (isNaN(id)) return c.text("Invalid ID", 400);

  try {
    const payment = await getpaymentService(id);
    if (!payment) {
      return c.text("Payment not found", 404);
    }
    return c.json(payment, 200);
  } catch (error: any) {
    console.error("Error retrieving payment:", error);
    return c.json({ error: error?.message }, 500);
  }
};

// Create Payment
const paymentService = createPaymentService();

export const createPayment = {
  async createCheckoutSession(c: Context) {
    try {
      const requestBody = await c.req.json();

      const bookingId = requestBody?.bookingId;
      const amount = requestBody?.amount;

      if (!bookingId || !amount) {
        return c.json({ success: false, error: "Booking ID and amount are required" }, 400);
      }

      console.log(`Check if id and amount are being received: bookingId: ${bookingId}, amount: ${amount}`);

      const session = await paymentService.createCheckoutSession(bookingId, amount);

      return c.json({ sessionId: session.id, checkoutUrl: session.url });
    } catch (error: any) {
      console.error("Error creating checkout session:", error);
      return c.json({ success: false, error: "Failed to create checkout session" }, 500);
    }
  }
};

// Update Payment
export const updatepayment = async (c: Context) => {
  const id = parseInt(c.req.param("id"));
  if (isNaN(id)) return c.text("Invalid ID", 400);

  try {
    const paymentData = await c.req.json();
    const existingPayment = await getpaymentService(id);
    if (!existingPayment) return c.text("Payment not found", 404);

    const result = await updatepaymentService(id, paymentData);
    if (!result) return c.text("Payment not updated", 404);

    return c.json({ msg: result }, 200);
  } catch (error: any) {
    console.error("Error updating payment:", error);
    return c.json({ error: error?.message }, 500);
  }
};

// Delete Payment
export const deletepayment = async (c: Context) => {
  const id = Number(c.req.param("id"));
  if (isNaN(id)) return c.text("Invalid ID", 400);

  try {
    const existingPayment = await getpaymentService(id);
    if (!existingPayment) return c.text("Payment not found", 404);

    const result = await deletepaymentService(id);
    if (!result) return c.text("Payment not deleted", 404);

    return c.json({ msg: result }, 200);
  } catch (error: any) {
    console.error("Error deleting payment:", error);
    return c.json({ error: error?.message }, 500);
  }
};
