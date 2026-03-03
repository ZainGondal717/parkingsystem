import Stripe from "stripe";
import prisma from "@/lib/prisma";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(request) {
    try {
        const { paymentIntentId, bookingDetails } = await request.json();

        if (!paymentIntentId) {
            return new Response(
                JSON.stringify({ error: "Missing payment intent ID" }),
                { status: 400, headers: { "Content-Type": "application/json" } }
            );
        }

        // Retrieve payment intent from Stripe to verify it succeeded
        const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

        if (paymentIntent.status !== "succeeded") {
            return new Response(
                JSON.stringify({ error: "Payment was not successful" }),
                { status: 400, headers: { "Content-Type": "application/json" } }
            );
        }

        // Payment verified successfully
        // The booking will be created in the handlePaymentSuccess callback on the frontend
        // This route just verifies that the payment succeeded

        return new Response(
            JSON.stringify({
                success: true,
                paymentIntentId: paymentIntentId,
                message: "Payment verified successfully. Booking will be created.",
            }),
            {
                status: 200,
                headers: { "Content-Type": "application/json" },
            }
        );
    } catch (error) {
        console.error("Payment Confirmation Error:", error);
        return new Response(
            JSON.stringify({
                error: error.message || "Failed to confirm payment",
            }),
            { status: 500, headers: { "Content-Type": "application/json" } }
        );
    }
}
