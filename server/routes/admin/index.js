// 1. 导出一个函数，这个函数接收一个对象app
module.exports = app => {
    // 2. 在这个对象里面就可以用最外层的app

    const express = require('express')
    // 3. 这里是express的一个子路由，当我们需要子路由的时候，就用它。
    const router = express.Router()
    // 6. 
    const Category = require('../../models/Category')
    router.post('/categories', async (req, res) => {
        // 5.这里我们会涉及到把数据存进去，因此需要数据库
        // 7. 引入Catehory后，继续把数据存进去 (下面要想使用的话，必须加上await)
        const model = await Category.create(req.body) //定义一个model
        // 8.发回客户端，让它知道我们创建完成了，以及创建的数据是什么
        res.send(model)
    })
    app.use('/admin/api', router) // 4. 将子路由挂载到这个地方，不然每次写路由都要加上/admin/api很麻烦
}

// 9.这样我们的分类接口就定义好了，/admin/api/categories，下一步就是去前端发起接口请求。