import * as cheerio from 'cheerio';

export async function getFavicon(url: string): Promise<string> {
    try {
        const response = await fetch(url);
        const html = await response.text();
        const $ = cheerio.load(html);

        // Check standard link tags
        let icon = $('link[rel="icon"]').attr('href') ||
            $('link[rel="shortcut icon"]').attr('href') ||
            $('link[rel="apple-touch-icon"]').attr('href');

        if (!icon) {
            // Fallback to strict domain root favicon
            const urlObj = new URL(url);
            return `${urlObj.protocol}//${urlObj.hostname}/favicon.ico`;
        }

        // Handle relative URLs
        if (icon && !icon.startsWith('http')) {
            const urlObj = new URL(url);
            if (icon.startsWith('//')) {
                return `${urlObj.protocol}${icon}`;
            }
            if (icon.startsWith('/')) {
                return `${urlObj.protocol}//${urlObj.hostname}${icon}`;
            }
            // Relative to current path - simplified assumption: relative to root
            return `${urlObj.protocol}//${urlObj.hostname}/${icon}`;
        }

        return icon;
    } catch (error) {
        console.error('Error fetching favicon:', error);
        // Fallback
        try {
            const urlObj = new URL(url);
            return `${urlObj.protocol}//${urlObj.hostname}/favicon.ico`;
        } catch {
            return '/favicon.ico'; // Last resort
        }
    }
}
