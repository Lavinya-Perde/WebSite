import { NextRequest, NextResponse } from 'next/server';
import { list } from '@vercel/blob';

export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const service = searchParams.get('service');

        if (!service) {
            return NextResponse.json({ error: 'Service parameter is required' }, { status: 400 });
        }

        console.log('Fetching images for service:', service);

        // Vercel Blob'dan servise ait tüm dosyaları al
        const { blobs } = await list({
            prefix: `${service}/`,
        });

        console.log('Found blobs:', blobs.length);

        // Sadece görsel dosyalarını filtrele ve formatla
        const images = blobs
            .filter(blob => {
                const ext = blob.pathname.split('.').pop()?.toLowerCase() || '';
                return ['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext);
            })
            .map(blob => ({
                name: blob.pathname.split('/').pop() || blob.pathname,
                path: blob.url,
                url: blob.url,
                size: blob.size,
                uploadedAt: blob.uploadedAt
            }))
            .sort((a, b) => {
                // En yeni yüklenenler önce
                return new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime();
            });

        return NextResponse.json({ images });
    } catch (error) {
        console.error('Error reading images from Vercel Blob:', error);
        return NextResponse.json({
            error: 'Failed to read images',
            details: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 });
    }
}

