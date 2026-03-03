import Stripe from "stripe";
import prisma from "@/lib/prisma";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

export async function POST(request) {
    try {
        const body = await request.text();
        const signature = request.headers.get("stripe-signature");

        if (!signature) {
            return new Response("No signature", { status: 400 });
        }

        // Verify webhook signature
        let event;
        try {
            event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
        } catch (err) {
            console.error("Webhook signature verification failed:", err.message);
            return new Response(`Webhook Error: ${err.message}`, {
                status: 400,
            });
        }

        // Handle different event types
        switch (event.type) {
            case "payment_intent.succeeded":
                await handlePaymentIntentSucceeded(event.data.object);
                break;

            case "payment_intent.payment_failed":
                await handlePaymentIntentFailed(event.data.object);
                break;

            case "payment_intent.canceled":
                await handlePaymentIntentCanceled(event.data.object);
                break;

            default:
                console.log(`Unhandled event type ${event.type}`);
        }

        return new Response(JSON.stringify({ received: true }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });
    } catch (error) {
        console.error("Webhook handler error:", error);
        return new Response(
            JSON.stringify({ error: error.message }),
            { status: 500, headers: { "Content-Type": "application/json" } }
        );
    }
}

async function handlePaymentIntentSucceeded(paymentIntent) {
    try {
        const metadata = paymentIntent.metadata || {};
        
        // 🛡️ FRAUD PROTECTION: Verify metadata exists
        if (!metadata.carNumber || metadata.carNumber === "N/A") {
            console.warn("⚠️ Payment succeeded but missing vehicle metadata:", paymentIntent.id);
        }

        // 🛡️ FRAUD PROTECTION: Verify amount matches expected
        if (metadata.expectedAmount) {
            const expectedAmount = parseInt(metadata.expectedAmount);
            if (paymentIntent.amount !== expectedAmount) {
                console.error("🚨 FRAUD ALERT: Amount mismatch!", {
                    paymentIntentId: paymentIntent.id,
                    expectedAmount,
                    actualAmount: paymentIntent.amount,
                    metadata
                });
                // Log fraud attempt but don't block (payment already succeeded)
                await prisma.paymentTransaction.updateMany({
                    where: { paymentIntentId: paymentIntent.id },
                    data: { 
                        status: "fraud_suspected",
                        errorMessage: `Amount mismatch: expected ${expectedAmount}, got ${paymentIntent.amount}`
                    }
                });
                return;
            }
        }

        // 📝 Update transaction log
        await prisma.paymentTransaction.updateMany({
            where: { paymentIntentId: paymentIntent.id },
            data: {
                status: "succeeded",
                chargeId: paymentIntent.latest_charge || null,
            }
        });

        // Find and update booking by payment intent ID (if booking exists)
        const booking = await prisma.booking.findFirst({
            where: { paymentIntentId: paymentIntent.id },
        });

        if (booking) {
            await prisma.booking.update({
                where: { id: booking.id },
                data: {
                    paymentStatus: "completed",
                    paidAt: new Date(),
                },
            });
            console.log(
                `✅ Payment succeeded for booking ${booking.id}`,
                paymentIntent.id
            );
        } else {
            console.log(
                `✅ Payment succeeded (no booking linked yet):`,
                paymentIntent.id,
                `Vehicle: ${metadata.carNumber}`
            );
        }
    } catch (error) {
        console.error("Error handling payment_intent.succeeded:", error);
        throw error;
    }
}

async function handlePaymentIntentFailed(paymentIntent) {
    try {
        const errorMessage = paymentIntent.last_payment_error?.message || "Unknown error";
        const errorCode = paymentIntent.last_payment_error?.code || "unknown";

        // 📝 Update transaction log with failure details
        await prisma.paymentTransaction.updateMany({
            where: { paymentIntentId: paymentIntent.id },
            data: {
                status: "failed",
                errorCode: errorCode,
                errorMessage: errorMessage,
            }
        });

        const booking = await prisma.booking.findFirst({
            where: { paymentIntentId: paymentIntent.id },
        });

        if (booking) {
            await prisma.booking.update({
                where: { id: booking.id },
                data: {
                    paymentStatus: "failed",
                    paymentFailureReason: errorMessage,
                },
            });
            console.log(
                `❌ Payment failed for booking ${booking.id}:`,
                errorMessage
            );
        } else {
            console.log(`❌ Payment failed:`, paymentIntent.id, errorMessage);
        }
    } catch (error) {
        console.error("Error handling payment_intent.payment_failed:", error);
        throw error;
    }
}

async function handlePaymentIntentCanceled(paymentIntent) {
    try {
        // 📝 Update transaction log
        await prisma.paymentTransaction.updateMany({
            where: { paymentIntentId: paymentIntent.id },
            data: { status: "canceled" }
        });

        const booking = await prisma.booking.findFirst({
            where: { paymentIntentId: paymentIntent.id },
        });

        if (booking) {
            await prisma.booking.update({
                where: { id: booking.id },
                data: {
                    paymentStatus: "canceled",
                },
            });
            console.log(
                `⏸️ Payment canceled for booking ${booking.id}`,
                paymentIntent.id
            );
        }
    } catch (error) {
        console.error("Error handling payment_intent.canceled:", error);
        throw error;
    }
}


