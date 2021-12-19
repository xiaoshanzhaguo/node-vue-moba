// 1. mongoose先引入进来
const mongoose = require('mongoose')

// 导出再建立一个schema,用它去定义模型的字段有哪些
const schema = new mongoose.Schema({
    // 【英雄编辑-模型字段】 下面是称号
    title: { type: String },
    // 【英雄编辑-模型字段】英雄类型，需要和分类进行关联 ref里是指定它要关联的模型
    // category: {type: mongoose.Schema.Types.ObjectId, ref: 'Category'}

    // 【文章管理】 1. 重申分类的关联，分类是可以选多个的，因此名称是复数，类型是个数组，
    // 数组里面表示它的具体数据类型是ObjectId，是一个分类的Id。关联的模型是Category——分类
    categories: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Category' }],
    // 【文章管理】 2. 在模型里加上详情，能让它保存这个字段
    body: {type: String}
})

// 导出mongoose.model (弹幕：实例这个category并导出)
module.exports = mongoose.model('Article', schema)