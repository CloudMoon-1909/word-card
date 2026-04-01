/**
 * 单词卡片 - 主逻辑
 */

// ========================================
// 全局变量
// ========================================

let words = [];              // 原始数据
let currentFilter = "unfamiliar";   // 当前筛选条件
let currentWorkList = [];   // 当前工作列表（单词对象引用）
let currentIndex = 0;       // 当前工作列表中的索引
let currentRatio = { unfamiliar: 5, somewhat: 3, familiar: 2 }; // 默认配比
// ========================================
// DOM 元素
// ========================================

const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const levelBtns = document.querySelectorAll('.level-btn');
const filterBtns = document.querySelectorAll('.filter-btn');

// ========================================
// 初始化函数
// ========================================

function init() {
    // 加载单词数据
    const savedWords = loadWords();
    if (savedWords) {
        words = savedWords;
    } else {
        words = JSON.parse(JSON.stringify(wordsData));
    }

    // 加载配比
    const savedRatio = loadRatio();
    if (savedRatio) {
        currentRatio = savedRatio;
        // 同步到输入框
        document.getElementById('ratioUnfamiliar').value = currentRatio.unfamiliar;
        document.getElementById('ratioSomewhat').value = currentRatio.somewhat;
        document.getElementById('ratioFamiliar').value = currentRatio.familiar;
    } else {
        currentRatio = { unfamiliar: 5, somewhat: 3, familiar: 2 };
    }

    // 生成工作列表
    updateWorkList();

    // 更新统计
    updateStats();

    // 更新剩余单词数
    updateRemainingCount();

    // 绑定事件
    bindEvents();

    // 配比区域初始隐藏（总体记忆时才显示）
    const ratioArea = document.getElementById('ratioArea');
    if (ratioArea && currentFilter !== 'overall') {
        ratioArea.style.display = 'none';
    }
}

/**
 * 根据 currentFilter 生成工作列表（引用原始单词对象）
 */
function updateWorkList() {
    if (currentFilter === "overall") {
        currentWorkList = words.filter(word =>
            word.level === "unfamiliar" ||
            word.level === "somewhat" ||
            word.level === "familiar"
        );
    } else {
        currentWorkList = words.filter(word => word.level === currentFilter);
    }

    // 重置索引
    if (currentWorkList.length > 0) {
        currentIndex = 0;
        displayWord(currentWorkList[currentIndex]);
    } else {
        showEmptyMessage();
    }

    // 更新单词列表面板
    updateWordListPanel();

    // 更新剩余单词数
    updateRemainingCount();
}

/**
 * 在卡片上显示单词
 */
function displayWord(word) {
    if (!word) {
        showEmptyMessage();
        return;
    }

    // 正面
    document.getElementById('cardWord').textContent = word.word;
    document.getElementById('cardPhonetic').textContent = word.phonetic || '';
    document.getElementById('cardExample').textContent = word.example || "暂无例句";

    // 反面
    document.getElementById('cardMeaning').textContent = word.meaning;
    document.getElementById('cardExampleTranslation').textContent = word.exampleTranslation || "暂无翻译";

    // 确保卡片未翻转
    const card = document.querySelector('.card');
    if (card.classList.contains('flipped')) {
        card.classList.remove('flipped');
    }

    // 更新单词列表高亮
    updateWordListPanel();
}

function showEmptyMessage() {
    document.getElementById('cardWord').textContent = "🎉 恭喜！";
    document.getElementById('cardPhonetic').textContent = "";
    document.getElementById('cardExample').textContent = "当前词库没有单词";
    document.getElementById('cardMeaning').textContent = "请切换到其他词库或导入新单词";
    document.getElementById('cardExampleTranslation').textContent = "";
}

function updateStats() {
    const stats = { unfamiliar: 0, somewhat: 0, familiar: 0, mastered: 0 };
    words.forEach(w => stats[w.level]++);

    document.getElementById('statUnfamiliar').textContent = stats.unfamiliar;
    document.getElementById('statSomewhat').textContent = stats.somewhat;
    document.getElementById('statFamiliar').textContent = stats.familiar;
    document.getElementById('statMastered').textContent = stats.mastered;
}

function updateRemainingCount() {
    let remaining = 0;
    if (currentFilter === "overall") {
        remaining = words.filter(w =>
            w.level === "unfamiliar" ||
            w.level === "somewhat" ||
            w.level === "familiar"
        ).length;
    } else if (currentFilter !== "mastered") {
        remaining = words.filter(w => w.level === currentFilter).length;
    }
    document.getElementById('remainingCount').textContent = remaining;
}

function nextWord() {
    if (currentWorkList.length === 0) return;
    if (currentFilter === 'overall') {
        // 总体记忆：按配比随机抽取新单词
        const newWord = getWordByRatio(words, currentRatio);
        if (newWord) {
            // 找到新单词在工作列表中的索引
            const newIndex = currentWorkList.findIndex(w => w.id === newWord.id);
            if (newIndex !== -1) {
                currentIndex = newIndex;
                displayWord(currentWorkList[currentIndex]);
            } else {
                // 理论上不会发生，但若未找到则使用旧逻辑
                currentIndex = (currentIndex + 1) % currentWorkList.length;
                displayWord(currentWorkList[currentIndex]);
            }
        } else {
            // 没有单词可复习，显示空状态
            showEmptyMessage();
        }
    } else {
        // 非总体记忆模式：顺序切换
        if (currentIndex < currentWorkList.length - 1) {
            currentIndex++;
            displayWord(currentWorkList[currentIndex]);
        } else {
            // 已是最后一个，可提示
        }
    }
}

function prevWord() {
    if (currentWorkList.length === 0) return;
    if (currentIndex > 0) {
        currentIndex--;
        displayWord(currentWorkList[currentIndex]);
    } else {
        console.log("已经是第一个单词");
    }
}

function markWordLevel(newLevel) {
    const currentWord = currentWorkList[currentIndex];
    if (!currentWord) return;

    const originalWord = words.find(w => w.id === currentWord.id);
    if (originalWord) {
        originalWord.level = newLevel;
        console.log(`标记单词 "${originalWord.word}" 为 ${getLevelName(newLevel)}`);
        saveWords(words);  // 保存到 localStorage
    }

    updateStats();
    updateRemainingCount();

    // 判断当前工作列表是否为空（剩余单词数0）
    let willBeEmpty = false;
    if (currentFilter === "overall") {
        const remainingCount = words.filter(w =>
            w.level === "unfamiliar" ||
            w.level === "somewhat" ||
            w.level === "familiar"
        ).length;
        willBeEmpty = remainingCount === 0;
    } else {
        const remainingCount = words.filter(w => w.level === currentFilter).length;
        willBeEmpty = remainingCount === 0;
    }

    if (willBeEmpty) {
        updateWorkList(); // 重新生成工作列表，会显示空状态
        return;
    }

    // 自动切换到下一个单词
    if (currentFilter === 'overall') {
        const newWord = getWordByRatio(words, currentRatio);
        if (newWord) {
            const newIndex = currentWorkList.findIndex(w => w.id === newWord.id);
            if (newIndex !== -1) {
                currentIndex = newIndex;
                displayWord(currentWorkList[currentIndex]);
            } else {
                updateWorkList();
                if (currentWorkList.length > 0) {
                    currentIndex = 0;
                    displayWord(currentWorkList[currentIndex]);
                } else {
                    showEmptyMessage();
                }
            }
        } else {
            showEmptyMessage();
        }
    } else {
        if (currentWorkList.length > 0) {
            currentIndex = (currentIndex + 1) % currentWorkList.length;
            displayWord(currentWorkList[currentIndex]);
        } else {
            showEmptyMessage();
        }
    }
}

function getLevelName(level) {
    const names = {
        unfamiliar: "不认识",
        somewhat: "不太熟",
        familiar: "认识",
        mastered: "完全熟"
    };
    return names[level] || level;
}

function switchFilter(filter) {
    currentFilter = filter;

    // 更新筛选按钮样式
    filterBtns.forEach(btn => {
        if (btn.dataset.filter === filter) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });

    // 配比区域显示控制
    const ratioArea = document.getElementById('ratioArea');
    ratioArea.style.display = filter === 'overall' ? 'block' : 'none';

    // 重新生成工作列表
    updateWorkList();
}

function updateWordListPanel() {
    const container = document.getElementById('wordListContainer');
    if (!container) return;

    container.innerHTML = '';
    currentWorkList.forEach((word, idx) => {
        const item = document.createElement('div');
        item.className = 'word-list-item';
        if (idx === currentIndex) {
            item.classList.add('active');
        }
        item.textContent = word.word;
        item.addEventListener('click', () => {
            currentIndex = idx;
            displayWord(currentWorkList[currentIndex]);
            updateWordListPanel(); // 刷新高亮
        });
        container.appendChild(item);
    });
}

function bindEvents() {
    // 上一个/下一个
    prevBtn.addEventListener('click', prevWord);
    nextBtn.addEventListener('click', nextWord);

    // 等级标记按钮
    levelBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const level = btn.classList.contains('unfamiliar') ? 'unfamiliar' :
                btn.classList.contains('somewhat') ? 'somewhat' :
                    btn.classList.contains('familiar') ? 'familiar' : 'mastered';
            markWordLevel(level);
        });
    });

    // 词库筛选
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const filter = btn.dataset.filter;
            switchFilter(filter);
        });
    });

    // 卡片翻转
    const cardElement = document.querySelector('.card');
    cardElement.addEventListener('click', (e) => {
        e.stopPropagation();
        cardElement.classList.toggle('flipped');
    });

    // 折叠单词列表按钮
    const toggleBtn = document.getElementById('toggleWordListBtn');
    const wordListPanel = document.getElementById('wordListPanel');
    toggleBtn.addEventListener('click', () => {
        if (wordListPanel.style.display === 'none') {
            wordListPanel.style.display = 'block';
            toggleBtn.textContent = '🔽 收起列表';
        } else {
            wordListPanel.style.display = 'none';
            toggleBtn.textContent = '📋 查看单词列表';
        }
    });

    // 配比输入框变化时更新 currentRatio
    const ratioUnfamiliar = document.getElementById('ratioUnfamiliar');
    const ratioSomewhat = document.getElementById('ratioSomewhat');
    const ratioFamiliar = document.getElementById('ratioFamiliar');

    function updateRatio() {
        currentRatio = {
            unfamiliar: parseInt(document.getElementById('ratioUnfamiliar').value) || 0,
            somewhat: parseInt(document.getElementById('ratioSomewhat').value) || 0,
            familiar: parseInt(document.getElementById('ratioFamiliar').value) || 0
        };
        saveRatio(currentRatio);
    }

    ratioUnfamiliar.addEventListener('input', updateRatio);
    ratioSomewhat.addEventListener('input', updateRatio);
    ratioFamiliar.addEventListener('input', updateRatio);

    // 导入单词本
    const importFileInput = document.getElementById('importFile');
    importFileInput.addEventListener('change', async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        try {
            const importedWords = await importWordBook(file);
            // 替换单词数据
            words = importedWords;
            // 保存到 localStorage
            saveWords(words);

            // 重置筛选为“不认识”，因为新单词都是不认识
            currentFilter = 'unfamiliar';
            // 更新筛选按钮样式
            filterBtns.forEach(btn => {
                if (btn.dataset.filter === currentFilter) {
                    btn.classList.add('active');
                } else {
                    btn.classList.remove('active');
                }
            });
            // 隐藏配比区域（因为当前不在总体记忆）
            document.getElementById('ratioArea').style.display = 'none';

            // 重新生成工作列表
            updateWorkList();
            // 更新统计
            updateStats();
            // 更新剩余单词数
            updateRemainingCount();

            // 可选：显示成功提示
            alert(`导入成功！共 ${importedWords.length} 个单词，全部放入“不认识”词库。`);
        } catch (err) {
            alert('导入失败：' + err.message);
        } finally {
            // 清空 file input，允许重复导入同一个文件
            importFileInput.value = '';
        }
    });
}

// 启动应用
document.addEventListener('DOMContentLoaded', init);