import { NextRequest, NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const service = searchParams.get('service');

        if (!service) {
            return NextResponse.json({ error: 'Service parameter is required' }, { status: 400 });
        }

        console.log('Fetching images for service:', service);

        // Cloudinary'den servise ait tüm görselleri al
        const result = await cloudinary.search
            .expression(`folder:${service}/*`)
            .sort_by('created_at', 'desc')
            .max_results(100)
            .execute();

        console.log('Found images:', result.resources?.length || 0);

        const images = (result.resources || []).map((resource: { public_id: string; secure_url: string; bytes: number; created_at: string }) => ({
            name: resource.public_id.split('/').pop() || resource.public_id,
            path: resource.secure_url,
            url: resource.secure_url,
            size: resource.bytes,
            uploadedAt: resource.created_at,
        }));

        return NextResponse.json({ images });
    } catch (error) {
        console.error('Error reading images from Cloudinary:', error);
        return NextResponse.json({
            error: 'Failed to read images',
            details: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 });
    }
}
