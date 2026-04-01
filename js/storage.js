/**
 * 本地存储模块
 */

const STORAGE_KEYS = {
    WORDS: 'wordCard_words',
    RATIO: 'wordCard_ratio'
};

/**
 * 保存单词数据
 * @param {Array} words - 单词数组
 */
function saveWords(words) {
    localStorage.setItem(STORAGE_KEYS.WORDS, JSON.stringify(words));
}

/**
 * 加载单词数据
 * @returns {Array|null} 保存的单词数组，若不存在则返回 null
 */
function loadWords() {
    const data = localStorage.getItem(STORAGE_KEYS.WORDS);
    return data ? JSON.parse(data) : null;
}

/**
 * 保存配比
 * @param {Object} ratio - 配比对象 { unfamiliar, somewhat, familiar }
 */
function saveRatio(ratio) {
    localStorage.setItem(STORAGE_KEYS.RATIO, JSON.stringify(ratio));
}

/**
 * 加载配比
 * @returns {Object|null} 保存的配比，若不存在则返回 null
 */
function loadRatio() {
    const data = localStorage.getItem(STORAGE_KEYS.RATIO);
    return data ? JSON.parse(data) : null;
}