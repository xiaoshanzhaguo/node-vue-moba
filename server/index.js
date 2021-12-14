// 1.引入express
const express = require("express")

// 2.定义一个app，是express的实例
const app = express()

// 7.加一个跨域模块
app.use(require('cors')())
// 8.加一个中间件
app.use(express.json())

// 5.引用 这样就能实现在admin里面使用app
require('./routes/admin')(app)

// 6.引用数据库
require('./plugins/db')(app)

// 3.启动 在3000端口，同时传入一个回调函数，表示的是启动之后做什么
app.listen(3000, () => {
    console.log('http://localhost:3000'); // 输出接口地址
});

// 4.写分类路由，分类路由不应该写在这里，应该写到具体的页面里面去，
// 因为我们可能会有很多路由，如果全部写在一个页面，会很乱。