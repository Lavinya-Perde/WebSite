import { NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';
import path from 'path';

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST() {
    try {
        console.log('=== Starting Migration to Cloudinary ===');

        const services = [
            { folder: 'slider', path: 'public/slider' },
            { folder: 'gallery', path: 'public/gallery' },
            { folder: 'fon-perde', path: 'public/services/fon-perde' },
            { folder: 'tul-perde', path: 'public/services/tul-perde' },
            { folder: 'stor-perde', path: 'public/services/stor-perde' },
            { folder: 'hali', path: 'public/services/hali' },
            { folder: 'duvar-kagidi', path: 'public/services/duvar-kagidi' },
            { folder: 'montaj', path: 'public/services/montaj' },
        ];

        const results: Record<string, { success: number; failed: number; files: string[] }> = {};

        for (const service of services) {
            const fullPath = path.join(process.cwd(), service.path);

            results[service.folder] = {
                success: 0,
                failed: 0,
                files: []
            };

            // Klasör yoksa atla
            if (!fs.existsSync(fullPath)) {
                console.log(`Skipping ${service.folder} - directory not found`);
                continue;
            }

            // Klasördeki dosyaları oku
            const files = fs.readdirSync(fullPath);
            const imageFiles = files.filter(file => {
                const ext = path.extname(file).toLowerCase();
                return ['.jpg', '.jpeg', '.png', '.gif', '.webp'].includes(ext);
            });

            console.log(`Found ${imageFiles.length} images in ${service.folder}`);

            // Her görseli Cloudinary'ye yükle
            for (const file of imageFiles) {
                try {
                    const filePath = path.join(fullPath, file);

                    const timestamp = Date.now();
                    const randomSuffix = Math.random().toString(36).substring(2, 8);
                    const publicId = `${service.folder}/${timestamp}-${randomSuffix}`;

                    console.log(`Uploading ${file} as ${publicId}...`);

                    const result = await cloudinary.uploader.upload(filePath, {
                        public_id: publicId,
                        resource_type: 'image',
                        overwrite: true,
                    });

                    results[service.folder].success++;
                    results[service.folder].files.push(result.secure_url);
                    console.log(`Uploaded: ${result.secure_url}`);

                } catch (error) {
                    console.error(`Failed to upload ${file}:`, error);
                    results[service.folder].failed++;
                }
            }
        }

        const totalSuccess = Object.values(results).reduce((sum, r) => sum + r.success, 0);
        const totalFailed = Object.values(results).reduce((sum, r) => sum + r.failed, 0);

        console.log('=== Migration Complete ===');
        console.log(`Total uploaded: ${totalSuccess}`);
        console.log(`Total failed: ${totalFailed}`);

        return NextResponse.json({
            success: true,
            message: `Migration completed: ${totalSuccess} uploaded, ${totalFailed} failed`,
            results
        });

    } catch (error) {
        console.error('Migration error:', error);
        return NextResponse.json({
            error: 'Migration failed',
            details: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 });
    }
}
