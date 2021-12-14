// 4.数据库插件的写法就写好啦  module.exports导出一个函数，接收一个参数app
module.exports = app => {
    // 1.这里面去引用moogoose
    const mongoose = require("mongoose")   
    // 2.moogose去连接mongodb
    mongoose.connect('mongodb://127.0.0.1:27017/node-vue-moba', {
        // 3.这里是连接的参数
        useNewUrlParser: true
    })
}