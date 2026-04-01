/**
 * 单词本导入模块
 */

/**
 * 验证单词数据格式
 * @param {Array} data - 待验证的数据
 * @returns {boolean} 是否有效
 */
function isValidWordData(data) {
    if (!Array.isArray(data) || data.length === 0) return false;
    // 检查每个单词是否包含必要字段
    for (let item of data) {
        if (!item.word || !item.meaning) return false;
        // 可选字段：id, phonetic, example, exampleTranslation, level
        // 如果不含 id，我们会在导入时自动生成
    }
    return true;
}

/**
 * 规范化导入的单词数据（补充默认字段）
 * @param {Array} rawData - 原始导入数据
 * @returns {Array} 规范化后的单词数组
 */
function normalizeWordData(rawData) {
    return rawData.map((item, index) => ({
        id: item.id || Date.now() + index,  // 如果没有 id，生成唯一 id
        word: item.word,
        meaning: item.meaning,
        phonetic: item.phonetic || '',
        example: item.example || '',
        exampleTranslation: item.exampleTranslation || '',
        level: 'unfamiliar'  // 所有新导入单词初始为“不认识”
    }));
}

/**
 * 导入单词本（通过文件选择）
 * @param {File} file - 用户选择的 JSON 文件
 * @returns {Promise<Array>} 解析后的单词数组
 */
function importWordBook(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const rawData = JSON.parse(e.target.result);
                if (!isValidWordData(rawData)) {
                    reject(new Error('文件格式无效：必须包含 word 和 meaning 字段，且为数组'));
                    return;
                }
                const normalized = normalizeWordData(rawData);
                resolve(normalized);
            } catch (err) {
                reject(new Error('JSON 解析失败：' + err.message));
            }
        };
        reader.onerror = () => reject(new Error('文件读取失败'));
        reader.readAsText(file, 'UTF-8');
    });
}