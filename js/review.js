/**
 * 复习算法模块 - 配比随机抽取
 */

/**
 * 根据配比从不认识、不太熟、认识三个词库中随机抽取一个单词
 * @param {Array} words - 所有单词数据
 * @param {Object} ratio - 配比对象，如 { unfamiliar: 5, somewhat: 3, familiar: 2 }
 * @returns {Object|null} 被选中的单词对象，如果没有可选的单词则返回 null
 */
function getWordByRatio(words, ratio) {
    // 获取三个等级的词库
    const unfamiliarList = words.filter(w => w.level === 'unfamiliar');
    const somewhatList = words.filter(w => w.level === 'somewhat');
    const familiarList = words.filter(w => w.level === 'familiar');

    // 如果没有可复习的单词，返回 null
    if (unfamiliarList.length === 0 && somewhatList.length === 0 && familiarList.length === 0) {
        return null;
    }

    // 构造抽取池：根据配比生成各等级单词的副本
    const pool = [];

    // 每个等级单词的副本数量 = 配比值 × 该等级单词数量（确保每个单词出现概率均等）
    // 更简单的方法：按比例随机选择等级，再从该等级中随机选一个单词
    // 这里采用“先选等级，再选单词”的方式，更符合直觉

    // 计算总权重
    const totalWeight = ratio.unfamiliar + ratio.somewhat + ratio.familiar;
    if (totalWeight === 0) return null;

    // 随机选择等级
    const rand = Math.random() * totalWeight;
    let selectedLevel = null;
    if (rand < ratio.unfamiliar) {
        selectedLevel = 'unfamiliar';
    } else if (rand < ratio.unfamiliar + ratio.somewhat) {
        selectedLevel = 'somewhat';
    } else {
        selectedLevel = 'familiar';
    }

    // 从选中的等级中随机选一个单词
    let list;
    switch (selectedLevel) {
        case 'unfamiliar':
            list = unfamiliarList;
            break;
        case 'somewhat':
            list = somewhatList;
            break;
        case 'familiar':
            list = familiarList;
            break;
        default:
            return null;
    }

    if (list.length === 0) {
        // 如果该等级没有单词，递归重试（或降级到其他等级）
        // 简单处理：从非空等级中随机选一个
        const nonEmpty = [];
        if (unfamiliarList.length) nonEmpty.push('unfamiliar');
        if (somewhatList.length) nonEmpty.push('somewhat');
        if (familiarList.length) nonEmpty.push('familiar');
        if (nonEmpty.length === 0) return null;
        const fallbackLevel = nonEmpty[Math.floor(Math.random() * nonEmpty.length)];
        list = fallbackLevel === 'unfamiliar' ? unfamiliarList :
            fallbackLevel === 'somewhat' ? somewhatList : familiarList;
    }

    const randomIndex = Math.floor(Math.random() * list.length);
    return list[randomIndex];
}