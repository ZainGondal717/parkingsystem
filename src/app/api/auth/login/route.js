import { NextResponse } from "next/server";

export async function POST(req) {
    try {
        const { email, password } = await req.json();

        // Exact credentials requested by user
        const ADMIN_EMAIL = "zain@gmail.com";
        const ADMIN_PASSWORD = "zain1234";

        if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
            return NextResponse.json({
                success: true,
                message: "Authentication successful",
                user: { email: ADMIN_EMAIL, name: "Zain Admin" }
            });
        }

        return NextResponse.json(
            { success: false, message: "Invalid email or password" },
            { status: 401 }
        );
    } catch (error) {
        console.error("Login Error:", error);
        return NextResponse.json(
            { success: false, message: "Internal server error" },
            { status: 500 }
        );
    }
}
