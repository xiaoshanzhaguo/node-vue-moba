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
    // 1.修改操作
    router.put('/categories/:id', async (req, res) => {
        // 2.根据id去找，找到后更新数据，req.body是内容
        const model = await Category.findByIdAndUpdate(req.params.id, req.body)
        res.send(model)
    })
    // 1.删除操作
    router.delete('/categories/:id', async (req, res) => {
        // 2.删完之后，我们不需要获取它的返回值，只需要给客户端返回一个success: true
        await Category.findByIdAndDelete(req.params.id, req.body)
        res.send({
            success: true
        })
    })
    // 1.再来一个分类列表，定义到categories 这里表示分类列表
    router.get('/categories', async (req, res) => {
        // 2.限制10条数据 当然不限制也可以，我们暂时先限制一下
        const items = await Category.find().limit(10) 
        res.send(items) //直接把数据发回给前端
    })
    // 1.获取详情页的分类接口
    router.get('/categories/:id', async (req, res) => {
        const model = await Category.findById(req.params.id)
        // 2.返回model
        res.send(model)
    })
    app.use('/admin/api', router) 
}

// 9.这样我们的分类接口就定义好了，/admin/api/categories，下一步就是去前端发起接口请求。