import { eq } from "drizzle-orm";
import db, { stripe } from "../drizzle/db";
import { Bookings, Payments } from "../drizzle/schema";
import { TIPayments, TSPayments } from "../drizzle/schema";

// List Payments
export const paymentsService = async () => {
  return await db.query.Payments.findMany({
    columns: {
      id: true,
      booking_id: true,
      amount: true,
      payment_date: true,
      payment_method: true,
      payment_status: true
    },
    with: {
      booking: {
        columns: {
          id: true,
          user_id: true,
          vehicle_id: true,
          location_id: true
        }
      }
    }
  });
};

// Get Payment by ID
export const getpaymentService = async (id: number): Promise<TSPayments | undefined> => {
  return await db.query.Payments.findFirst({
    where: eq(Payments.id, id),
    with: {
      booking: {
        columns: {
          id: true,
          user_id: true,
          vehicle_id: true,
          location_id: true
        }
      }
    }
  });
};

// Create Payment and Checkout Session
export const createPaymentService = () => {
  return {
    async createCheckoutSession(bookingId: number, amount: number) {
      try {
        // Ensure Stripe expects the amount in cents
        const session = await stripe.checkout.sessions.create({
          payment_method_types: ["card"],
          line_items: [
            {
              price_data: {
                currency: "usd",
                product_data: {
                  name: "Car Booking",
                },
                unit_amount: amount * 100, // Convert amount to cents
              },
              quantity: 1,
            },
          ],
          mode: "payment",
          success_url: `${process.env.FRONTEND_URL}/user`,
          cancel_url: `${process.env.FRONTEND_URL}/booking-cancelled`,
          metadata: {
            bookingId: bookingId.toString(), // Ensure bookingId is a string
          },
        });

        const paymentIntent = await stripe.paymentIntents.create({
          amount: amount * 100, // Convert amount to cents
          currency: 'usd',
          metadata: { booking_id: bookingId.toString() }, // Ensure booking_id is a string
        });

        // Update booking status
        await db
          .update(Bookings)
          .set({ booking_status: "confirmed" })
          .where(eq(Bookings.id, bookingId));

        // Insert payment record into the database
        await db.insert(Payments).values([{
          booking_id: bookingId,
          amount: amount.toString(),
          payment_date: new Date().toISOString(),
          payment_status: 'confirmed',
          payment_method: 'credit_card',
          transaction_id: paymentIntent.id,
        }]).execute();

        return session;
      } catch (error: any) {
        console.error("Error creating checkout session:", error);
        throw new Error("Failed to create checkout session");
      }
    }
  };
};

// Update Payment
export const updatepaymentService = async (id: number, payment: TIPayments) => {
  await db.update(Payments).set(payment).where(eq(Payments.id, id));
  return "Payment updated successfully";
};

// Delete Payment
export const deletepaymentService = async (id: number) => {
  await db.delete(Payments).where(eq(Payments.id, id));
  return "Payment deleted successfully";
};
