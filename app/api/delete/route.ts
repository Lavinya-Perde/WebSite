import { NextRequest, NextResponse } from 'next/server';
import { del } from '@vercel/blob';

export async function DELETE(request: NextRequest) {
    try {
        const body = await request.json();
        const { service, filename, url } = body;

        if (!service || (!filename && !url)) {
            return NextResponse.json(
                { error: 'Service and filename or url are required' },
                { status: 400 }
            );
        }

        // URL varsa direkt onu kullan, yoksa path'den oluştur
        let blobUrl = url;

        if (!blobUrl && filename) {
            // Filename'den URL oluştur (images API'den gelen path aslında URL)
            console.log('Deleting by filename:', filename);
            // Eğer filename URL değilse, servise göre path oluştur
            if (!filename.startsWith('http')) {
                blobUrl = `${service}/${filename}`;
            } else {
                blobUrl = filename;
            }
        }

        console.log('Deleting blob:', blobUrl);

        // Vercel Blob'dan sil
        await del(blobUrl);

        return NextResponse.json({
            success: true,
            message: 'File deleted successfully'
        });
    } catch (error) {
        console.error('Delete error:', error);
        return NextResponse.json({
            error: 'Failed to delete file',
            details: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 });
    }
}

