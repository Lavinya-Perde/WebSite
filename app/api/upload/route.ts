import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(request: NextRequest) {
    try {
        console.log('=== Upload API Called ===');
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

        // Slider ve gallery için public klasörü altında, services için services klasörü altında
        let uploadDir: string;

        if (service === 'slider' || service === 'gallery') {
            uploadDir = path.join(process.cwd(), 'public', service);
        } else {
            uploadDir = path.join(process.cwd(), 'public', 'services', service);
        }

        console.log('Upload directory:', uploadDir);
        console.log('Directory exists:', fs.existsSync(uploadDir));

        // Klasör yoksa oluştur
        if (!fs.existsSync(uploadDir)) {
            console.log('Creating directory:', uploadDir);
            fs.mkdirSync(uploadDir, { recursive: true });
        }

        const uploadedFiles: string[] = [];

        for (const file of files) {
            console.log('Processing file:', file.name, 'Size:', file.size);
            const buffer = Buffer.from(await file.arrayBuffer());
            console.log('Buffer created, size:', buffer.length);

            // Dosya uzantısını al
            const ext = path.extname(file.name).toLowerCase();

            // Benzersiz dosya adı oluştur: servis-timestamp.ext
            const timestamp = Date.now();
            const randomSuffix = Math.random().toString(36).substring(2, 8);
            const fileName = `${service}-${timestamp}-${randomSuffix}${ext}`;

            const filePath = path.join(uploadDir, fileName);
            console.log('Saving to:', filePath);

            // Dosyayı kaydet
            fs.writeFileSync(filePath, buffer);
            console.log('File saved successfully');

            // Dosyanın gerçekten kaydedildiğini doğrula
            const fileExists = fs.existsSync(filePath);
            const fileSize = fileExists ? fs.statSync(filePath).size : 0;
            console.log('File exists after write:', fileExists, 'Size:', fileSize);

            uploadedFiles.push(fileName);
        }

        console.log('Upload complete. Files:', uploadedFiles);
        return NextResponse.json({
            success: true,
            files: uploadedFiles,
            message: `${uploadedFiles.length} file(s) uploaded successfully`
        });
    } catch (error) {
        console.error('Upload error:', error);
        return NextResponse.json({ error: 'Failed to upload files' }, { status: 500 });
    }
}
