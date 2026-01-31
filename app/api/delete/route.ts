import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function DELETE(request: NextRequest) {
    try {
        const body = await request.json();
        const { service, filename } = body;

        if (!service || !filename) {
            return NextResponse.json(
                { error: 'Service and filename are required' },
                { status: 400 }
            );
        }

        // Slider ve gallery için public klasörü altında, services için services klasörü altında
        let filePath: string;

        if (service === 'slider' || service === 'gallery') {
            filePath = path.join(process.cwd(), 'public', service, filename);
        } else {
            filePath = path.join(process.cwd(), 'public', 'services', service, filename);
        }

        // Dosya var mı kontrol et
        if (!fs.existsSync(filePath)) {
            return NextResponse.json(
                { error: 'File not found' },
                { status: 404 }
            );
        }

        // Güvenlik kontrolü - sadece izin verilen klasörler altındaki dosyalar silinebilir
        const publicDir = path.join(process.cwd(), 'public');
        if (!filePath.startsWith(publicDir)) {
            return NextResponse.json(
                { error: 'Invalid file path' },
                { status: 403 }
            );
        }

        // Dosyayı sil
        fs.unlinkSync(filePath);

        return NextResponse.json({
            success: true,
            message: 'File deleted successfully'
        });
    } catch (error) {
        console.error('Delete error:', error);
        return NextResponse.json(
            { error: 'Failed to delete file' },
            { status: 500 }
        );
    }
}
