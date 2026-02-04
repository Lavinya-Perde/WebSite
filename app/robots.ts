import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
    return {
        rules: {
            userAgent: '*',
            allow: '/',
            disallow: ['/admin', '/login', '/api/', '/perde-hesaplama'],
        },
        sitemap: 'https://lavinyaperde.com/sitemap.xml',
    }
}
