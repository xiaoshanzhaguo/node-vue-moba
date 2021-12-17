// 1. mongoose先引入进来
const mongoose = require('mongoose')

// 导出再建立一个schema,用它去定义模型的字段有哪些
const schema = new mongoose.Schema({
    name: { type: String },
    // 2.1 添加父级分类字段 下面的字段表示它是数据库里的一个id,
    // 第二个字段指定一个ref，表示它关联的是哪个模型(书写原因：h后面在实现这个分类的关联，把上级分类调出来时，
    // 它可以知道从哪里找，比如从Category模型里找当前分类ID等于parent，就能把当前分类的父级分类找出来
    parent: {type: mongoose.Schema.Types.ObjectId, ref:'Category'},
})

// 导出mongoose.model (弹幕：实例这个category并导出)
module.exports = mongoose.model('Category', schema)