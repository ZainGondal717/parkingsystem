import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "");

export async function POST(request) {
    try {
        // Validate Stripe key exists
        if (!process.env.STRIPE_SECRET_KEY) {
            throw new Error("Stripe Secret Key is not configured");
        }

        const body = await request.json();
        const { amount, bookingDetails } = body;

        // Validate amount
        if (!amount || typeof amount !== "number" || amount <= 0) {
            return new Response(
                JSON.stringify({ 
                    error: `Invalid amount: received ${typeof amount} value '${amount}'` 
                }),
                { status: 400, headers: { "Content-Type": "application/json" } }
            );
        }

        // Validate amount is reasonable (max $10,000)
        if (amount > 1000000) {
            return new Response(
                JSON.stringify({ error: "Amount exceeds maximum allowed ($10,000)" }),
                { status: 400, headers: { "Content-Type": "application/json" } }
            );
        }

        console.log("Creating payment intent with amount:", amount, "cents ($" + (amount / 100).toFixed(2) + ")");

        // Create payment intent
        const paymentIntent = await stripe.paymentIntents.create({
            amount: Math.round(amount), // Amount in cents
            currency: "usd",
            metadata: {
                carNumber: bookingDetails?.carNumber || "N/A",
                phoneNumber: bookingDetails?.phoneNumber || "N/A",
                lotId: bookingDetails?.lotId || "N/A",
                lotName: bookingDetails?.lotName || "N/A",
                slotNumber: bookingDetails?.slotNumber || "N/A",
            },
            description: `Parking booking - ${bookingDetails?.carNumber || "Unknown plate"}`,
        });

        console.log("✅ Payment intent created:", paymentIntent.id);

        return new Response(
            JSON.stringify({
                clientSecret: paymentIntent.client_secret,
                paymentIntentId: paymentIntent.id,
            }),
            {
                status: 200,
                headers: { "Content-Type": "application/json" },
            }
        );
    } catch (error) {
        console.error("❌ Payment Intent Creation Error:", {
            message: error.message,
            type: error.type,
            code: error.code,
            status: error.statusCode,
        });

        const errorMessage = error.message || "Failed to create payment intent";
        
        return new Response(
            JSON.stringify({ error: errorMessage }),
            { 
                status: 500, 
                headers: { "Content-Type": "application/json" } 
            }
        );
    }
}
