const { put, del, list } = require('@vercel/blob');
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

// Ayarlar
const MAX_WIDTH = 1920;  // Maksimum genişlik
const MAX_HEIGHT = 1080; // Maksimum yükseklik
const QUALITY = 80;      // JPEG kalitesi (1-100)

const SERVICE_FOLDERS = [
    'slider',
    'gallery',
    'fon-perde',
    'tul-perde',
    'stor-perde',
    'hali',
    'duvar-kagidi',
    'montaj'
];

const IMAGE_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];

async function deleteExistingBlobs() {
    console.log('\n[TEMİZLİK] Mevcut blob\'lar siliniyor...');

    for (const folder of SERVICE_FOLDERS) {
        try {
            const { blobs } = await list({ prefix: `${folder}/` });
            for (const blob of blobs) {
                await del(blob.url);
                console.log(`  ✗ Silindi: ${blob.pathname}`);
            }
        } catch (error) {
            // Klasör yoksa devam et
        }
    }
}

async function optimizeAndUpload() {
    console.log('=== Görsel Optimizasyon & Upload Script ===');
    console.log(`Ayarlar: ${MAX_WIDTH}x${MAX_HEIGHT}, Kalite: ${QUALITY}%\n`);

    if (!process.env.BLOB_READ_WRITE_TOKEN) {
        console.error('HATA: BLOB_READ_WRITE_TOKEN tanımlı değil!');
        process.exit(1);
    }

    // Önce mevcut blob'ları sil
    await deleteExistingBlobs();

    const publicDir = path.join(__dirname, '..', 'public');
    let totalUploaded = 0;
    let totalSaved = 0;

    for (const folder of SERVICE_FOLDERS) {
        const folderPath = path.join(publicDir, folder);

        if (!fs.existsSync(folderPath)) {
            console.log(`[ATLA] ${folder}/ klasörü bulunamadı`);
            continue;
        }

        console.log(`\n[İŞLE] ${folder}/`);

        const files = fs.readdirSync(folderPath);
        const imageFiles = files.filter(file => {
            const ext = path.extname(file).toLowerCase();
            return IMAGE_EXTENSIONS.includes(ext);
        });

        if (imageFiles.length === 0) {
            console.log(`  - Görsel bulunamadı`);
            continue;
        }

        for (const file of imageFiles) {
            const filePath = path.join(folderPath, file);
            const originalSize = fs.statSync(filePath).size;

            try {
                // Sharp ile optimize et (bozuk JPEG'leri de işle)
                const optimizedBuffer = await sharp(filePath, { failOnError: false })
                    .resize(MAX_WIDTH, MAX_HEIGHT, {
                        fit: 'inside',
                        withoutEnlargement: true
                    })
                    .jpeg({ quality: QUALITY, progressive: true })
                    .toBuffer();

                const newSize = optimizedBuffer.length;
                const savedPercent = Math.round((1 - newSize / originalSize) * 100);

                // Dosya adını .jpg olarak değiştir
                const newFileName = file.replace(/\.[^.]+$/, '.jpg');
                const blobPath = `${folder}/${newFileName}`;

                // Vercel Blob'a yükle
                const blob = await put(blobPath, optimizedBuffer, {
                    access: 'public',
                    addRandomSuffix: false,
                });

                console.log(`  ✓ ${file}`);
                console.log(`    ${(originalSize/1024/1024).toFixed(2)}MB → ${(newSize/1024/1024).toFixed(2)}MB (${savedPercent}% küçüldü)`);

                totalUploaded++;
                totalSaved += (originalSize - newSize);
            } catch (error) {
                console.error(`  ✗ ${file} - HATA: ${error.message}`);
            }
        }
    }

    console.log('\n=== Tamamlandı ===');
    console.log(`Yüklenen: ${totalUploaded} görsel`);
    console.log(`Toplam tasarruf: ${(totalSaved/1024/1024).toFixed(2)} MB`);
}

optimizeAndUpload().catch(console.error);
