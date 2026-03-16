/**
 * slugify.js
 * Pure utility function to convert strings into URL-friendly slugs.
 */
export function slugify(text) {
    if (!text) return '';
    return text.toString().toLowerCase()
        .trim()
        .replace(/\s+/g, '-')       // Replace spaces with -
        .replace(/[^\p{L}\p{N}\-_]+/gu, '') // Keep letters, numbers, hyphens, underscores (Unicode aware)
        .replace(/\-\-+/g, '-');    // Replace multiple - with single -
}
