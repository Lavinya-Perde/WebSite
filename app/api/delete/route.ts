import { NextRequest, NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

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

        // Public ID'yi belirle
        let publicId: string;

        if (url) {
            // URL'den public_id çıkar: https://res.cloudinary.com/.../upload/v123/folder/file.jpg
            const parts = url.split('/upload/');
            if (parts[1]) {
                // v123456/folder/file.jpg -> folder/file (uzantı ve version kaldır)
                publicId = parts[1].replace(/^v\d+\//, '').replace(/\.[^/.]+$/, '');
            } else {
                publicId = `${service}/${filename?.replace(/\.[^/.]+$/, '') || ''}`;
            }
        } else {
            // Filename'den public_id oluştur
            const cleanName = filename.replace(/\.[^/.]+$/, '');
            publicId = cleanName.includes('/') ? cleanName : `${service}/${cleanName}`;
        }

        console.log('Deleting from Cloudinary:', publicId);

        const result = await cloudinary.uploader.destroy(publicId);

        console.log('Delete result:', result);

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
