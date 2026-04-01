/**
 * 单词数据
 * 每个单词包含：
 * - id: 唯一标识
 * - word: 英文单词
 * - meaning: 中文释义
 * - example: 例句
 * - level: 掌握等级（unfamiliar/somewhat/familiar/mastered）
 */

const wordsData = [
    {
        id: 1,
        word: "apple",
        phonetic: "/ˈæp.əl/",
        meaning: "苹果",
        example: "I eat an apple every day.",
        exampleTranslation: "我每天吃一个苹果。",
        level: "unfamiliar"
    },
    {
        id: 2,
        word: "beautiful",
        phonetic: "/ˈbjuː.tɪ.fəl/",
        meaning: "美丽的",
        example: "The sunset is beautiful.",
        exampleTranslation: "日落很美。",
        level: "unfamiliar"
    },
    {
        id: 3,
        word: "challenge",
        phonetic: "/ˈtʃæl.ɪndʒ/",
        meaning: "挑战",
        example: "Learning a new language is a challenge.",
        exampleTranslation: "学习一门新语言是个挑战。",
        level: "unfamiliar"
    },
    {
        id: 4,
        word: "diligent",
        phonetic: "/ˈdɪl.ɪ.dʒənt/",
        meaning: "勤奋的",
        example: "She is a diligent student.",
        exampleTranslation: "她是个勤奋的学生。",
        level: "unfamiliar"
    },
    {
        id: 5,
        word: "enthusiastic",
        phonetic: "/ɪnˌθjuː.ziˈæs.tɪk/",
        meaning: "热情的",
        example: "He is enthusiastic about programming.",
        exampleTranslation: "他对编程充满热情。",
        level: "unfamiliar"
    },
    {
        id: 6,
        word: "friendly",
        phonetic: "/ˈfrend.li/",
        meaning: "友好的",
        example: "The locals are very friendly.",
        exampleTranslation: "当地人非常友好。",
        level: "unfamiliar"
    },
    {
        id: 7,
        word: "generous",
        phonetic: "/ˈdʒen.ər.əs/",
        meaning: "慷慨的",
        example: "He is generous with his time.",
        exampleTranslation: "他在时间上很慷慨。",
        level: "unfamiliar"
    },
    {
        id: 8,
        word: "honest",
        phonetic: "/ˈɒn.ɪst/",
        meaning: "诚实的",
        example: "Being honest is important.",
        exampleTranslation: "诚实很重要。",
        level: "unfamiliar"
    },
    {
        id: 9,
        word: "innovative",
        phonetic: "/ˈɪn.ə.və.tɪv/",
        meaning: "创新的",
        example: "This company is innovative.",
        exampleTranslation: "这家公司很有创新精神。",
        level: "unfamiliar"
    },
    {
        id: 10,
        word: "joyful",
        phonetic: "/ˈdʒɔɪ.fəl/",
        meaning: "快乐的",
        example: "The children are joyful.",
        exampleTranslation: "孩子们很快乐。",
        level: "unfamiliar"
    }
];

// 导出数据（后续 script.js 会使用）
if (typeof module !== 'undefined' && module.exports) {
    module.exports = wordsData;
}