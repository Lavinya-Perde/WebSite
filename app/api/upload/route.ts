import { NextRequest, NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';
import sharp from 'sharp';

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Optimizasyon ayarları
const MAX_WIDTH = 1920;
const MAX_HEIGHT = 1080;
const QUALITY = 80;

export async function POST(request: NextRequest) {
    try {
        console.log('=== Upload API Called (Cloudinary) ===');
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

            // Dosyayı buffer'a çevir
            const arrayBuffer = await file.arrayBuffer();
            const buffer = Buffer.from(arrayBuffer);

            // Sharp ile optimize et
            let optimizedBuffer: Buffer;
            try {
                optimizedBuffer = await sharp(buffer, { failOnError: false })
                    .resize(MAX_WIDTH, MAX_HEIGHT, {
                        fit: 'inside',
                        withoutEnlargement: true
                    })
                    .jpeg({ quality: QUALITY, progressive: true })
                    .toBuffer();

                console.log(`Optimized: ${file.size} -> ${optimizedBuffer.length} bytes`);
            } catch (sharpError) {
                console.error('Sharp optimization failed, using original:', sharpError);
                optimizedBuffer = buffer;
            }

            // Benzersiz dosya adı oluştur
            const timestamp = Date.now();
            const randomSuffix = Math.random().toString(36).substring(2, 8);
            const publicId = `${service}/${timestamp}-${randomSuffix}`;

            console.log('Uploading to Cloudinary:', publicId);

            // Cloudinary'ye yükle
            const result = await new Promise<{ secure_url: string; public_id: string }>((resolve, reject) => {
                cloudinary.uploader.upload_stream(
                    {
                        public_id: publicId,
                        folder: '',
                        resource_type: 'image',
                        overwrite: true,
                    },
                    (error, result) => {
                        if (error) reject(error);
                        else resolve(result as { secure_url: string; public_id: string });
                    }
                ).end(optimizedBuffer);
            });

            console.log('Cloudinary uploaded:', result.secure_url);

            uploadedFiles.push({
                name: result.public_id,
                url: result.secure_url
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
