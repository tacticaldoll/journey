/**
 * i18n.js
 * Lightweight, reactive internationalization module using Vue Composition API.
 * Follows the Pure SPA / CDN approach without requiring heavy external libraries.
 */
const { ref } = window.Vue || Vue;

// Define dictionaries
const dictionaries = {
    en: {
        menu: {
            home: 'Home',
            posts: 'Posts',
            tags: 'Tags',
            series: 'Series',
            search: 'Search',
            about: 'About'
        },
        ui: {
            readMore: 'Read More',
            goBack: 'Go Back',
            loadingFailed: 'Load Failed',
            notFoundText: 'The requested page could not be found or a server error occurred.',
            backToHome: 'Back to Home',
            searchHint: 'Search for posts or tags...',
            noResults: 'No results found for',
            copyright: 'Copyright {year} {title}. All rights reserved.',
            author: 'Author',
            readingTime: '{min} min read',
            words: '{count} words'
        },
        home: {
            latestArticles: 'Latest Articles'
        }
    },
    zh: {
        menu: {
            home: '首頁',
            posts: '文章',
            tags: '標籤',
            series: '系列',
            search: '搜尋',
            about: '關於'
        },
        ui: {
            readMore: '閱讀更多',
            goBack: '返回上一頁',
            loadingFailed: '載入失敗',
            notFoundText: '無法找到請求的頁面，或伺服器發生錯誤。',
            backToHome: '回到首頁',
            searchHint: '搜尋文章或標籤...',
            noResults: '找不到符合的結果：',
            copyright: '版權所有 {year} {title}。保留一切權利。',
            author: '作者',
            readingTime: '預計閱讀時間：{min} 分鐘',
            words: '共 {count} 字'
        },
        home: {
            latestArticles: '最新文章'
        }
    }
};

// Initialize locale from localStorage or default to 'en'
const savedLocale = localStorage.getItem('user-locale') || 'en';
export const currentLocale = ref(savedLocale);

/**
 * Toggle between English ('en') and Traditional Chinese ('zh')
 */
export const toggleLanguage = () => {
    currentLocale.value = currentLocale.value === 'en' ? 'zh' : 'en';
    localStorage.setItem('user-locale', currentLocale.value);
};

/**
 * Translation function
 * Usage: t('menu.home') or t('ui.readingTime', { min: 5 })
 * Returns the translation string or the key itself if not found.
 */
export const t = (key, params = {}) => {
    const keys = key.split('.');
    let result = dictionaries[currentLocale.value];

    // Attempt to traverse the dictionary for the current locale
    for (const k of keys) {
        if (result && result[k]) {
            result = result[k];
        } else {
            // Fallback to English if translation is missing
            result = dictionaries['en'];
            for (const fk of keys) {
                if (result && result[fk]) {
                    result = result[fk];
                } else {
                    return key; // Complete failure
                }
            }
            break;
        }
    }

    // Handle placeholder interpolation if params provided
    if (typeof result === 'string' && Object.keys(params).length > 0) {
        let str = result;
        for (const [pKey, pVal] of Object.entries(params)) {
            str = str.replace(new RegExp(`\\{${pKey}\\}`, 'g'), pVal);
        }
        return str;
    }

    return result;
};
