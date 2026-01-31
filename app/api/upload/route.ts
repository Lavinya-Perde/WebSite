import { NextRequest, NextResponse } from 'next/server';
import { put } from '@vercel/blob';

export async function POST(request: NextRequest) {
    try {
        console.log('=== Upload API Called (Vercel Blob) ===');
        const formData = await request.formData();
        const service = formData.get('service') as string;
        const files = formData.getAll('files') as File[];

        console.log('Service:', service);
        console.log('Files count:', files.length);

        if (!service) {
            console.log('ERROR: No service parameter');
            return NextResponse.json({ error: 'Service parameter is required' }, { status: 400 });
        }

        if (!files || files.length === 0) {
            console.log('ERROR: No files provided');
            return NextResponse.json({ error: 'No files provided' }, { status: 400 });
        }

        const uploadedFiles: Array<{ name: string; url: string }> = [];

        for (const file of files) {
            console.log('Processing file:', file.name, 'Size:', file.size);

            // Dosya uzantısını al
            const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg';

            // Benzersiz dosya adı oluştur: servis/timestamp-random.ext
            const timestamp = Date.now();
            const randomSuffix = Math.random().toString(36).substring(2, 8);
            const fileName = `${service}/${timestamp}-${randomSuffix}.${ext}`;

            console.log('Uploading to Vercel Blob:', fileName);

            // Vercel Blob'a yükle
            const blob = await put(fileName, file, {
                access: 'public',
                addRandomSuffix: false,
            });

            console.log('Blob uploaded:', blob.url);

            uploadedFiles.push({
                name: fileName,
                url: blob.url
            });
        }

        console.log('Upload complete. Files:', uploadedFiles.length);
        return NextResponse.json({
            success: true,
            files: uploadedFiles,
            message: `${uploadedFiles.length} file(s) uploaded successfully`
        });
    } catch (error) {
        console.error('Upload error:', error);
        return NextResponse.json({
            error: 'Failed to upload files',
            details: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 });
    }
}

