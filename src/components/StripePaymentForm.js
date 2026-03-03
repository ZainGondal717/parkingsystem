"use client";
import { useState, useEffect } from "react";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { Loader2, Lock, AlertCircle, Check, CreditCard } from "lucide-react";

export default function StripePaymentForm({
    amount,
    bookingDetails,
    onSuccess,
    onError,
    isProcessing = false
}) {
    const stripe = useStripe();
    const elements = useElements();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const [cardComplete, setCardComplete] = useState(false);
    const [clientSecret, setClientSecret] = useState(null);

    // Create payment intent when component mounts or amount changes
    useEffect(() => {
        const createPaymentIntent = async () => {
            // Ensure amount is always a number
            const numAmount = Math.max(0, parseFloat(amount) || 0);
            if (!numAmount || numAmount <= 0) return;

            try {
                const response = await fetch("/api/payments/create-payment-intent", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        amount: Math.round(numAmount * 100), // Convert to cents
                        bookingDetails,
                    }),
                });

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.error || `Failed to create payment intent (${response.status})`);
                }

                setClientSecret(data.clientSecret);
                setError(null);
            } catch (err) {
                console.error("Payment Intent Creation Error:", err);
                setError(err.message || "Failed to create payment intent");
            }
        };

        createPaymentIntent();
    }, [amount, bookingDetails]);

    const handleCardChange = (event) => {
        setError(event.error?.message || null);
        setCardComplete(event.complete);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        if (!stripe || !elements || !clientSecret) {
            setError("Payment system not ready. Please refresh and try again.");
            setLoading(false);
            return;
        }

        try {
            // Confirm payment with Stripe
            const { error: confirmError, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
                payment_method: {
                    card: elements.getElement(CardElement),
                    billing_details: {
                        phone: bookingDetails?.phoneNumber || "unknown",
                    },
                },
            });

            if (confirmError) {
                setError(confirmError.message);
                setLoading(false);
                onError?.(confirmError.message);
                return;
            }

            if (paymentIntent.status === "succeeded") {
                setSuccess(true);
                const confirmResponse = await fetch("/api/payments/confirm-payment", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        paymentIntentId: paymentIntent.id,
                        bookingDetails,
                    }),
                });

                if (!confirmResponse.ok) {
                    throw new Error("Failed to confirm payment on server");
                }

                setTimeout(() => {
                    onSuccess?.(paymentIntent);
                }, 1000);
            }
        } catch (err) {
            setError(err.message || "Payment failed. Please try again.");
            onError?.(err.message);
        } finally {
            setLoading(false);
        }
    };

    const cardElementOptions = {
        style: {
            base: {
                fontSize: "16px",
                color: "#424770",
                "::placeholder": { color: "#aab7c4" },
                fontFamily:
                    "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
            },
            invalid: { color: "#fa755a" },
        },
        hidePostalCode: true,
    };

    return (
        <div className="w-full space-y-4">
            {/* Success State */}
            {success ? (
                <div className="animate-in fade-in duration-500 space-y-4">
                    <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-6 text-center">
                        <div className="flex justify-center mb-4">
                            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center animate-pulse">
                                <Check className="w-8 h-8 text-emerald-600" />
                            </div>
                        </div>
                        <h3 className="text-lg font-black text-emerald-900 mb-2">
                            Payment Successful!
                        </h3>
                        <p className="text-sm text-emerald-700">
                            Your parking booking has been confirmed and paid.
                        </p>
                    </div>
                </div>
            ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Amount Display */}
                    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 rounded-xl p-4">
                        <div className="flex justify-between items-center">
                            <div>
                                <p className="text-xs font-bold text-blue-600 uppercase tracking-widest mb-1">
                                    Amount to Pay
                                </p>
                                <p className="text-3xl font-black text-blue-900 tracking-tighter">
                                    ${(parseFloat(amount) || 0).toFixed(2)}
                                </p>
                            </div>
                            <div className="w-14 h-14 bg-white rounded-xl shadow-sm border border-blue-100 flex items-center justify-center">
                                <CreditCard className="w-7 h-7 text-blue-600" />
                            </div>
                        </div>

                        {/* Booking Details Summary */}
                        {bookingDetails && (
                            <div className="mt-4 pt-4 border-t border-blue-100 space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-blue-700 font-semibold">Plate:</span>
                                    <span className="text-blue-900 font-black tracking-widest">
                                        {bookingDetails.carNumber}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-blue-700 font-semibold">Duration:</span>
                                    <span className="text-blue-900 font-bold">
                                        {bookingDetails.duration}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-blue-700 font-semibold">Location:</span>
                                    <span className="text-blue-900 font-bold">
                                        {bookingDetails.lotName}
                                    </span>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Card Element */}
                    <div className="space-y-3">
                        <label className="block text-xs font-bold text-gray-600 uppercase tracking-widest">
                            Card Information
                        </label>
                        <div className="border-2 border-gray-200 rounded-xl p-4 bg-white hover:border-blue-300 transition-colors focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-50">
                            <CardElement
                                options={cardElementOptions}
                                onChange={handleCardChange}
                            />
                        </div>
                    </div>

                    {/* Security Badge */}
                    <div className="flex items-center justify-center gap-2 text-xs text-gray-500 px-3 py-2 bg-gray-50 rounded-lg">
                        <Lock className="w-4 h-4 text-green-600" />
                        <span className="font-semibold">
                            Secure payment powered by{" "}
                            <span className="text-blue-600 font-black">Stripe</span>
                        </span>
                    </div>

                    {/* Loading State */}
                    {!clientSecret && !error && (
                        <div className="animate-in slide-in-from-top duration-300 flex items-center gap-3 bg-blue-50 border border-blue-200 rounded-xl p-4">
                            <Loader2 className="w-5 h-5 text-blue-600 animate-spin flex-shrink-0" />
                            <div>
                                <p className="text-sm font-bold text-blue-900">
                                    Preparing Payment
                                </p>
                                <p className="text-xs text-blue-700 mt-1">
                                    Initializing secure payment system...
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Error Message */}
                    {error && (
                        <div className="animate-in slide-in-from-top duration-300 flex items-start gap-3 bg-red-50 border border-red-200 rounded-xl p-4">
                            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                            <div>
                                <p className="text-sm font-bold text-red-900">
                                    Payment Error
                                </p>
                                <p className="text-xs text-red-700 mt-1">
                                    {error}
                                </p>
                                <p className="text-xs text-red-600 mt-2">
                                    💡 Tip: Check your amount and try again, or contact support if the problem persists.
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={loading || isProcessing || !cardComplete || !stripe || !clientSecret}
                        className={`w-full h-14 rounded-xl font-black text-lg flex items-center justify-center gap-2 transition-all active:scale-[0.98] shadow-lg ${
                            loading || isProcessing
                                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                                : !cardComplete || !stripe || !clientSecret
                                    ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                                    : "bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:shadow-xl hover:from-blue-700 hover:to-indigo-700"
                        }`}
                    >
                        {loading || isProcessing ? (
                            <>
                                <Loader2 className="w-5 h-5 animate-spin" />
                                <span>Processing...</span>
                            </>
                        ) : (
                            <>
                                <Lock className="w-5 h-5" />
                                <span>Pay ${typeof amount === "number" ? amount.toFixed(2) : "0.00"}</span>
                            </>
                        )}
                    </button>

                    {/* Terms */}
                    <p className="text-xs text-center text-gray-500 px-4">
                        By confirming this payment, you agree to our{" "}
                        <a href="#" className="text-blue-600 font-bold hover:underline">
                            Terms of Service
                        </a>{" "}
                        and{" "}
                        <a href="#" className="text-blue-600 font-bold hover:underline">
                            Privacy Policy
                        </a>
                    </p>
                </form>
            )}
        </div>
    );
}
