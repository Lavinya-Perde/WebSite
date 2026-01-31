import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const service = searchParams.get('service');

        if (!service) {
            return NextResponse.json({ error: 'Service parameter is required' }, { status: 400 });
        }

        // Slider ve gallery için public klasörü altında, services için services klasörü altında
        let imagesDir: string;
        let basePath: string;

        if (service === 'slider' || service === 'gallery') {
            imagesDir = path.join(process.cwd(), 'public', service);
            basePath = `/${service}`;
        } else {
            imagesDir = path.join(process.cwd(), 'public', 'services', service);
            basePath = `/services/${service}`;
        }

        // Klasör yoksa oluştur
        if (!fs.existsSync(imagesDir)) {
            fs.mkdirSync(imagesDir, { recursive: true });
            return NextResponse.json({ images: [] });
        }

        // Dosyaları oku
        const files = fs.readdirSync(imagesDir);

        const images = files
            .filter(file => {
                const ext = path.extname(file).toLowerCase();
                return ['.jpg', '.jpeg', '.png', '.gif', '.webp'].includes(ext);
            })
            .map(file => {
                const filePath = path.join(imagesDir, file);
                const stats = fs.statSync(filePath);

                return {
                    name: file,
                    path: `${basePath}/${file}`,
                    size: stats.size
                };
            })
            .sort((a, b) => a.name.localeCompare(b.name));

        return NextResponse.json({ images });
    } catch (error) {
        console.error('Error reading images:', error);
        return NextResponse.json({ error: 'Failed to read images' }, { status: 500 });
    }
}
