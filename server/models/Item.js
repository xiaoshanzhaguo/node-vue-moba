// 1. mongoose先引入进来
const mongoose = require('mongoose')

// 导出再建立一个schema,用它去定义模型的字段有哪些
const schema = new mongoose.Schema({
    name: { type: String },
    // 对于图片的保存，我们不会把完整的图片信息保存到数据库中 而是把图片上传一个图片地址，
    // 然后在这里用字符串的类型保存图片的地址，后期前端html展示页只需要图片地址
    icon: {type: String}
})

// 导出mongoose.model (弹幕：实例这个category并导出)
module.exports = mongoose.model('Item', schema)