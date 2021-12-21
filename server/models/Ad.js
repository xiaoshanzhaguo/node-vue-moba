// 1. mongoose先引入进来
const mongoose = require('mongoose')

// 导出再建立一个schema,用它去定义模型的字段有哪些
const schema = new mongoose.Schema({
    name: { type: String },
    // 【广告管理】 1. 里面的子元素有多个广告，用items
    items: [{
        image: { type: String },
        url: {type: String}, //点击图片之后跳转的路径
    }]
})

// 导出mongoose.model (弹幕：实例这个category并导出)
module.exports = mongoose.model('Ad', schema)