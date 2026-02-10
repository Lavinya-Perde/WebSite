import { NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Client-side upload için imzalı parametreler üret
export async function POST(request: Request) {
    try {
        const { service } = await request.json();

        if (!service) {
            return NextResponse.json({ error: 'Service parameter is required' }, { status: 400 });
        }

        const timestamp = Math.round(Date.now() / 1000);
        const randomSuffix = Math.random().toString(36).substring(2, 8);
        const publicId = `${service}/${timestamp}-${randomSuffix}`;

        // Cloudinary upload parametreleri
        const params = {
            timestamp,
            public_id: publicId,
            transformation: 'c_limit,w_1920,h_1080,q_80,f_jpg',
        };

        const signature = cloudinary.utils.api_sign_request(
            params,
            process.env.CLOUDINARY_API_SECRET!
        );

        return NextResponse.json({
            signature,
            timestamp,
            public_id: publicId,
            cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
            api_key: process.env.CLOUDINARY_API_KEY,
            transformation: params.transformation,
        });
    } catch (error) {
        console.error('Signature error:', error);
        return NextResponse.json({
            error: 'Failed to generate upload signature',
            details: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 });
    }
}
