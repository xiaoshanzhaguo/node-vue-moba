// 1. 导出一个函数，这个函数接收一个对象app
module.exports = app => {
    // 2. 在这个对象里面就可以用最外层的app

    const express = require('express')
    // 3. 这里是express的一个子路由，当我们需要子路由的时候，就用它。
    const router = express.Router({
        // 通用接口 2.
        mergeParams: true
    })
    // 6. 
    // const req.Model = require('../../models/req.Model')
    router.post('/', async (req, res) => {
        // 5.这里我们会涉及到把数据存进去，因此需要数据库
        // 7. 引入Catehory后，继续把数据存进去 (下面要想使用的话，必须加上await)
        // 【通用接口】1. 下面的resource值获取时 是小写的，我们要把它转换成类名，要调用其他方法. npm i inflection
        // 接上面。在app.use里定义了参数，同时在router里面用到了resource。所以需要在Router上面加参数，表示合并特殊参数
        // 否则resource在这里获取不到，把父级的url参数合并到router里面的这些路由里，让它们都能访问得到
        // 我们以分类列表为例子。
        const model = await req.Model.create(req.body) //定义一个model
        // 8.发回客户端，让它知道我们创建完成了，以及创建的数据是什么
        res.send(model)
    })
    // 1.修改操作
    router.put('/:id', async (req, res) => {
        // 2.根据id去找，找到后更新数据，req.body是内容
        const model = await req.Model.findByIdAndUpdate(req.params.id, req.body)
        res.send(model)
    })
    // 1.删除操作
    router.delete('/:id', async (req, res) => {
        // 2.删完之后，我们不需要获取它的返回值，只需要给客户端返回一个success: true
        await req.Model.findByIdAndDelete(req.params.id, req.body)
        res.send({
            success: true
        })
    })
    // 1.再来一个分类列表，定义到categories 这里表示分类列表
    router.get('/', async (req, res) => {
        // 2.限制10条数据 当然不限制也可以，我们暂时先限制一下
        // 【子分类】 populate里放关联的字段，我们可以通过这个字段把它查出来
        // 我们要的parent并不是id,而是一个完整的信息，并把它变成对象
        // 【通用接口】 3.
        // 【通用接口】 5. classify是转类名的意思 下面实现将小写复数的形式转换为大写的单数类名
        // const modelName = require('inflection').classify(req.params.resource) 
        // const Model = require(`../../models/${modelName}`)  
        // 【通用接口】 返回查看modelName是否是我们想要的格式
        // return res.send({ modelName })
        // const items = await req.Model.find().populate('parent').limit(10) 
        // 【通用分类】 实现扩展性，让代码更加安全
        const queryOptions = {}
        if (req.Model.modelName === 'Category') {
            queryOptions.populate = 'parent'
        }
        const items = await req.Model.find().setOptions(queryOptions).limit(10)
        res.send(items) //直接把数据发回给前端
    })
    // 1.获取详情页的分类接口
    router.get('/:id', async (req, res) => {
        const model = await req.Model.findById(req.params.id)
        // 2.返回model
        res.send(model)
    })
    // 【通用接口】4. 因为下面加了rest，因此对应前端部分也要修改，否则会报错。
    // 前面加rest的原因是怕影响到别的接口，防止接口地址冲突
    app.use('/admin/api/rest/:resource', async (req, res, next) => {
        // 【通用接口】 6.先做下面的操作，然后再到next，就是去处理下一个，哪一个呢？后面的？
        const modelName = require('inflection').classify(req.params.resource)  // 取出资源的名称再把它转成模型的名称
        // const Model = require(`../../models/${modelName}`)  
        //require进来，然后就得到模型的类，如果直接用const，那在后面是访问不到的，
        // 所以要把它加入req的model，表示是给请求对象挂载一个属性model。
        // 这样在后面的请求中。它们就可以用在上一个请求函数里的req.Model来使用它。
        // ！！！一定要想象到在express里的链式操作，它其实是一个路径对应很多个处理函数 
        // 先处理第一个，当在函数里用next()，就会调用第二个。我们平时为什么没见到next呢？其实只是省略了next()
        // 之前我们写的接口，一般来说，写一个接口，返回一个数据后，已经是最终一个了，它不需要再调用后续的其他操作，因此我们往往省略
        req.Model = require(`../../models/${modelName}`)  
        next()
    }, router) 
}

// 9.这样我们的分类接口就定义好了，/admin/api/categories，下一步就是去前端发起接口请求。