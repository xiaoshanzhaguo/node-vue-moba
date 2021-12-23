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
        await req.Model.findByIdAndDelete(req.params.id) // 这后面不用加req.body，因为我们只需要根据id查找
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

    // 【图片上传】 2. 先定义一个multer，再定义一个上传中间件（定义好就可以在下面直接用），执行它，同时传递一个destination 目标地址
    const multer = require('multer')
    const upload = multer({dest:__dirname + '/../../uploads'}) //一定要加dirname，使用绝对地址（windows从c:，mac从/开始的地址）

    // 【图片上传】 1. 在这里能获取到上传文件，但是express本身获取不到上传文件的数据，
    // 因此我们要使用中间件来专门处理上传数据 npm i multer
    // 【图片上传】3. 定义后直接使用upload，single表示上传单个文件，
    // 字段名就是前面写的file（在接口里传了一个Form Data，名字叫file）
    // 上面的file是可以改的，在el-upload里通过一个参数去配置，这样我们就可以允许接口去上传文件
    app.post('/admin/api/upload',upload.single('file'), async (req, res) => {
        // 接收到的文件在这里 简单的操作是把它return回去就可以了
        // return res.file
        // 本身在express里是没有req.file这个东西的，是因为我们用了upload、multer这个中间件，
        // 它会向上面的代码里一样，在req里给我们加一个Model，而这里是把上传文件的数据赋值到req上，因此才有req.file

        const file = req.file
        // 【图片上传】4. 我们要给file拼出一个url 下面 file.url先写死，因为以后可能会是固定的地址(一定是服务的的地址)
        file.url = `http://localhost:3000/uploads/${file.filename}`
        res.send(file) 
    })

    // 【登录接口】 1. 写登录路由  
    app.post('/admin/api/login', async (req, res) => {
        // 2. 我们应该是在前端把用户名和密码传过来，然后在这里校验，最终得到一些数据，看看是否成功。
        // 返回前端一个token，一串密钥，让它去保存这个密钥。后续通过这个密钥去证明自己是哪个用户。
        // res.send('ok') // 先让接口能调通

        // 3. 到了服务器这边，无非是把数据接收过来，然后在数据库进行查找。
        // 首先定义一个解构赋值 req.body就表示客户端传过来的所有数据(一个对象，有username，有password)
        // 我们把里面的username和password分别解构出来。这样操作比较简单，
        // 否则你就定义一个data = req.body，username = data.username。因为解构赋值比较简单一点，直接取对象里的username和password。
        const { username, password } = req.body
        
        // 4. 拿到这两个东西后，我们应该想如何去操作。
        // 一定要分清楚，我们没办法通过用户名和密码直接去找用户，只能根据用户名去找，因为密码被散列，被加密了，已经被换成密文了。
        // 所以通过明文的123456找密文是找不到的，而且如果你把明文的123456用brcypt散列一下，再去查找，也是找不到的，
        // 因为每一次的散列都会生成新的hash。因此我们只能一步步来，先通过username找到这个用户。

        // 4.1 根据用户名找用户
        // 那我们需要用到用户的模型，把用户的模型引用进来
        const AdminUser = require('../../models/AdminUser')
        // 下面是username: username键值对简写的方式，它们两正好一致，我们就可以写成简写方式。
        const user = await AdminUser.findOne({username}).select('+password') //这里加上select的意思是把password取出来，因为默认是不取它的，我们要用加号，要取它
        
        if (!user) {
            // 设置状态码，并发送一段数据。平时我们是直接res.send发送，下面的写法表示的是适龄状态码再发送，
            // 这样客户端至少知道不是正常的200，不是一个普通正常的请求。（这里去查看network，发现状态码422，返回用户名不存在）
            return res.status(422).send({
                message: '用户不存在'
                // 有了这个消息，前端就能把它显示出来（去http里全局捕获）
            })
        }

        // 4.2 校验密码
        // 如果用户存在，就去校验密码；如果不存在，就抛出异常来。
        // 引入bcrypt加密密码的模块  compareSync比较明文和密文是否匹配
        const isValid = require('bcryptjs').compareSync(password, user.password) //因此之前在模型里设置了select: false，因此默认是取不到值的。
        if (!isValid) {
            // 统一422表示客户端提交的数据有问题，验证错误，当然你也可以用400或者别的，只不过老师习惯用422。在resForm规范里，也有建议用422的
            return res.status(422).send({
                message: '密码错误'
            })
        }
        

        // 4.3 返回token
        // 返回token，我们需要用到一个jsonwebtoken，在服务端里进行安装。这个是现在比较流行的，做web token验证的
        const jwt = require('jsonwebtoken')
        // 用sign(签名)来生成一个token。接收参数，第一个payload——你要放到token里的数据
        // （这个token不是简单的随机字符串，它是把一个数据拿来进行散列，最后生成一个字符串拿去给客户端使用）
        // 这里用一个对象比较好一点，我们只要保存用户的唯一id就够了，或者把用户的个人信息也保存进去，比如用户名是什么
        const token = jwt.sign({
            id: user._id,
            // _id: user._id,
            // // 不过大多数情况下，我们并不需要用户名，因为用户的用户名一般都是拿到id后自己把它获取出来的。
            // // 只是说在jwt.sign里面可以加任何类型的数据。
            // username: user.username  我们这里为了简单只放一个数据
        },
            // 它还有第二个参数，很重要，secret是个密钥，这个表示在生成token的时候，我们给它一个密钥。
            // 给了这个密钥之后，它就会根据一定的算法去生成token，生成完后，客户端是可以不需要密钥把数据解出来，
            // 但是一旦要验证是否正确（是否被客户端篡改过），我们就必要用另外一个成对的方法jwt.sign对应的jwt.verify去校验
            // 所以这就需要服务端给一个密钥，哪怕客户端篡改了这个信息，那服务端也能识别出来这个是无效的
            // 这个密钥随便给它一个字符串就可以。但是不能直接写在这里，它应该是一个全局的东西，所以下面涉及到给全局加一个属性（index.js）

            // !!!!  这里要看根目录下的index.js
            app.get('secret') // 这个get只能获取一个参数，它与我们定义路由的get名字其实是冲突的，所以这里通过参数名来区别，你是在定义路由还是配置。
        )
        res.send({ token })
        // 当然这里还可以返回用户名，客户端就可以提示一下（这里老师直接在console里输出了token）
        // 5. 然后去前端把token保存下来
    })
}

// 9.这样我们的分类接口就定义好了，/admin/api/categories，下一步就是去前端发起接口请求。