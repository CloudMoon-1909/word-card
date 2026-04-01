/**
 * 单词本导入模块
 */

/**
 * 导入 JSON 单词本
 * @param {File} file - 选择的 JSON 文件
 * @param {Function} onSuccess - 导入成功回调
 * @param {Function} onError - 导入失败回调
 */
function importWordBook(file, onSuccess, onError) {
    const reader = new FileReader();

    reader.onload = function(e) {
        try {
            const importedWords = JSON.parse(e.target.result);

            // 验证数据格式
            if (!validateWords(importedWords)) {
                throw new Error('单词数据格式不正确，请检查 JSON 结构');
            }

            // 为每个单词生成唯一 id（如果原数据没有 id 或 id 冲突）
            const wordsWithId = importedWords.map((word, index) => ({
                ...word,
                id: word.id || Date.now() + index,
                level: word.level || 'unfamiliar'  // 默认等级为“不认识”
            }));

            // 替换全局单词数组
            words = wordsWithId;

            // 保存到 localStorage
            saveWords(words);

            // 重新初始化界面
            updateWorkList();
            updateStats();
            updateRemainingCount();

            // 执行成功回调
            if (onSuccess) onSuccess(words.length);
        } catch (error) {
            console.error('导入失败:', error);
            if (onError) onError(error.message);
        }
    };

    reader.onerror = function() {
        if (onError) onError('文件读取失败');
    };

    reader.readAsText(file, 'UTF-8');
}

/**
 * 验证导入的单词数据格式
 * @param {Array} words - 待验证的单词数组
 * @returns {boolean}
 */
function validateWords(words) {
    if (!Array.isArray(words) || words.length === 0) {
        return false;
    }

    // 检查每个单词的必要字段
    const requiredFields = ['word', 'meaning'];
    return words.every(word => {
        return requiredFields.every(field => word.hasOwnProperty(field));
    });
}

/**
 * 导出当前单词本为 JSON 文件（扩展功能）
 */
function exportWordBook() {
    const dataStr = JSON.stringify(words, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `wordbook_${new Date().toISOString().slice(0,19)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}