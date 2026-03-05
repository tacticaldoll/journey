/**
 * i18nHelper.js
 * Utility for handling translation string replacements.
 */
import { t } from '../i18n.js';

/**
 * Formats a translation string with parameters.
 * @param {string} key - The translation key.
 * @param {Object} params - Key-value pairs for replacement.
 * @returns {string}
 */
export function formatT(key, params = {}) {
    let text = t(key);
    Object.entries(params).forEach(([k, v]) => {
        text = text.replace(new RegExp(`\\{${k}\\}`, 'g'), v);
    });
    return text;
}
