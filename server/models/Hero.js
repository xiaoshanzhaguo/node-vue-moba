// 1. mongoose先引入进来
const mongoose = require('mongoose')

// 导出再建立一个schema,用它去定义模型的字段有哪些
const schema = new mongoose.Schema({
    name: { type: String },
    // 对于图片的保存，我们不会把完整的图片信息保存到数据库中 而是把图片上传一个图片地址，
    // 然后在这里用字符串的类型保存图片的地址，后期前端html展示页只需要图片地址
    avatar: { type: String },
    
    // 【英雄编辑-模型字段】 下面是称号
    title: { type: String },
    // 【英雄编辑-模型字段】英雄类型，需要和分类进行关联 ref里是指定它要关联的模型
    // category: {type: mongoose.Schema.Types.ObjectId, ref: 'Category'}
    categories: [{type: mongoose.Schema.Types.ObjectId, ref: 'Category'}],
    // 评分
    scores: {
        difficult: { type: Number }, //难度
        skills: { type: Number }, //技能
        attack: { type: Number }, //攻击
        survive: { type: Number } //生存
    },
    // 技能
    skills: [{
        icon: {type: String}, //图标
        name: {type: String}, //名称
        description: { type: String }, //介绍
        tips: {type: String} //小提示
    }],
    // 出装
    items1: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Item' }], //顺风出装
    items2: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Item' }], //逆风出装
    // 使用技巧
    usageTips: { type: String },
    // 对抗技巧
    battleTips: { type: String },
    // 团战思路
    teamTips: { type: String },
    // 英雄关系（这里只写一个就可以了，比如说最佳搭档，其他都是一样的，只要自己去定义多个就可以了）
    partners: [{
        hero: { type: mongoose.Schema.Types.ObjectId, ref: 'Hero' },
        description: {type: String}
    }]
})

// 导出mongoose.model (弹幕：实例这个category并导出)
module.exports = mongoose.model('Hero', schema)