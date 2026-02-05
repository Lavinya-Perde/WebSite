const { list } = require('@vercel/blob');
const cloudinary = require('cloudinary').v2;

// Requires env variables: BLOB_READ_WRITE_TOKEN, CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET
// Run: node --env-file=.env.local scripts/blob-to-cloudinary.js

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const SERVICES = ['slider', 'gallery', 'fon-perde', 'tul-perde', 'stor-perde', 'hali', 'duvar-kagidi', 'montaj'];

async function migrate() {
    console.log('=== Blob -> Cloudinary Migration ===\n');

    let totalSuccess = 0;
    let totalFailed = 0;

    for (const service of SERVICES) {
        console.log(`\n--- ${service} ---`);

        try {
            // Vercel Blob'dan listele
            const { blobs } = await list({ prefix: `${service}/` });

            const imageBlobs = blobs.filter(blob => {
                const ext = blob.pathname.split('.').pop()?.toLowerCase() || '';
                return ['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext);
            });

            console.log(`Found ${imageBlobs.length} images in Blob`);

            for (const blob of imageBlobs) {
                try {
                    const filename = blob.pathname.split('/').pop().replace(/\.[^/.]+$/, '');
                    const publicId = `${service}/${filename}`;

                    console.log(`  Uploading: ${blob.pathname} -> ${publicId}`);

                    // Blob URL'den direkt Cloudinary'ye yukle
                    const result = await cloudinary.uploader.upload(blob.url, {
                        public_id: publicId,
                        resource_type: 'image',
                        overwrite: true,
                    });

                    console.log(`  OK: ${result.secure_url}`);
                    totalSuccess++;
                } catch (err) {
                    console.error(`  FAIL: ${blob.pathname}`, err.message);
                    totalFailed++;
                }
            }
        } catch (err) {
            console.error(`  Error listing ${service}:`, err.message);
        }
    }

    console.log(`\n=== Migration Complete ===`);
    console.log(`Success: ${totalSuccess}`);
    console.log(`Failed: ${totalFailed}`);
}

migrate();
