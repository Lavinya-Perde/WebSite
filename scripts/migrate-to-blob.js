const { put } = require('@vercel/blob');
const fs = require('fs');
const path = require('path');

// Migrate edilecek klasörler
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

// Desteklenen görsel formatları
const IMAGE_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];

async function migrateToBlob() {
    console.log('=== Vercel Blob Migration Script ===\n');

    // BLOB_READ_WRITE_TOKEN kontrolü
    if (!process.env.BLOB_READ_WRITE_TOKEN) {
        console.error('HATA: BLOB_READ_WRITE_TOKEN environment variable tanımlı değil!');
        console.log('\nÇözüm:');
        console.log('1. Vercel Dashboard > Storage > Blob\'dan token\'ı kopyala');
        console.log('2. Şu şekilde çalıştır:');
        console.log('   BLOB_READ_WRITE_TOKEN=vercel_blob_xxx node scripts/migrate-to-blob.js');
        process.exit(1);
    }

    const publicDir = path.join(__dirname, '..', 'public');
    let totalUploaded = 0;
    let totalFailed = 0;

    for (const folder of SERVICE_FOLDERS) {
        const folderPath = path.join(publicDir, folder);

        // Klasör var mı kontrol et
        if (!fs.existsSync(folderPath)) {
            console.log(`[ATLA] ${folder}/ klasörü bulunamadı`);
            continue;
        }

        console.log(`\n[TARA] ${folder}/`);

        // Klasördeki dosyaları oku
        const files = fs.readdirSync(folderPath);
        const imageFiles = files.filter(file => {
            const ext = path.extname(file).toLowerCase();
            return IMAGE_EXTENSIONS.includes(ext);
        });

        if (imageFiles.length === 0) {
            console.log(`  - Görsel bulunamadı`);
            continue;
        }

        console.log(`  - ${imageFiles.length} görsel bulundu`);

        // Her görseli yükle
        for (const file of imageFiles) {
            const filePath = path.join(folderPath, file);
            const blobPath = `${folder}/${file}`;

            try {
                // Dosyayı oku
                const fileBuffer = fs.readFileSync(filePath);

                // Vercel Blob'a yükle
                const blob = await put(blobPath, fileBuffer, {
                    access: 'public',
                    addRandomSuffix: false,
                });

                console.log(`  ✓ ${file} -> ${blob.url}`);
                totalUploaded++;
            } catch (error) {
                console.error(`  ✗ ${file} - HATA: ${error.message}`);
                totalFailed++;
            }
        }
    }

    console.log('\n=== Migration Tamamlandı ===');
    console.log(`Başarılı: ${totalUploaded}`);
    console.log(`Başarısız: ${totalFailed}`);
}

migrateToBlob().catch(console.error);
