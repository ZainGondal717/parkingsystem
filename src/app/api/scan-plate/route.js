import { NextResponse } from 'next/server';

export async function POST(req) {
    try {
        const { image } = await req.json(); // base64 image (includes data:image/...;base64,)
        const token = process.env.PLATE_RECOGNIZER_TOKEN;

        if (!token || token === "YOUR_PLATE_RECOGNIZER_TOKEN_HERE") {
            return NextResponse.json({ error: "Plate Recognizer Token is not configured." }, { status: 500 });
        }

        // Plate Recognizer snapshot API prefers multipart/form-data
        // Convert the base64 to a Blob / Buffer for multipart
        const base64Content = image.split(',')[1];
        const buffer = Buffer.from(base64Content, 'base64');

        const formData = new FormData();
        const blob = new Blob([buffer], { type: 'image/jpeg' });
        formData.append('upload', blob, 'image.jpg');

        const response = await fetch("https://api.platerecognizer.com/v1/plate-reader/", {
            method: "POST",
            headers: {
                "Authorization": `Token ${token}`,
            },
            body: formData,
        });

        const data = await response.json();

        if (response.status !== 200 && response.status !== 201) {
            console.error("Plate Recognizer API Error:", data);
            return NextResponse.json({
                error: typeof data === 'string' ? data : (data.err || data.detail || "Plate Recognizer API Error")
            }, { status: response.status });
        }

        if (!data.results || data.results.length === 0) {
            return NextResponse.json({ text: "" });
        }

        // Plate Recognizer returns the best match in the results array
        // It provides the cleanest plate text possible
        const bestPlate = data.results[0].plate.toUpperCase();

        return NextResponse.json({ text: bestPlate });
    } catch (error) {
        console.error("Plate Recognizer Server Error:", error);
        return NextResponse.json({ error: "Failed to process image with Plate Recognizer API." }, { status: 500 });
    }
}
