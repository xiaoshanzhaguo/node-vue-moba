import axios from 'axios'
import Vue from 'vue'


const http = axios.create({
    //这里是指向的接口地址。3000表示后台的接口地址，它的api加一个前缀，放到admin/api下面。
    baseURL: 'http://localhost:3000/admin/api'  
})

// 【服务端登录校验(jwt)】在这里里面加一个给所有接口的请求，加一个请求头，把localStorge的东西提取出来（这里去看了Npm官网 axios里）
// 拦截器
http.interceptors.request.use(function (config) {
    // 我们在这里加token。 是这样子传，但是这样不符合规范（浏览器里能查看到数据，request Headers里多了东西，
    // 它是一个标准的请求头，就是授权的时候，如果你有什么授权信息的话，可以用这个Authorization来传，后面的值传你的授权信息，
    // 我们这里就是一个我们存储的jwt token）
    // 更标准的格式是在前面加一个类型Bearer ，因为我们不光是只有这一种类型，这是一个行业规范
    // (然后这里可以看到浏览器多了前面的类型，服务端要做的事情就是把token提取出来，看是不是真正数据库里的用户
    // 当然如果客户端完全没传这个东西，那肯定是什么都没有。比如我们直接请求接口的话，请求头里无任何的Authorization
    // 因为这个只有在我们前端用http发起请求时，给它加了Authorization才会有)
    config.headers.Authorization = 'Bearer ' + localStorage.token
    return config
}, function (err) {

    return Promise.response.reject(err)
})

// 【登录接口】 1. 在http里全局捕获 下面就是给整个http请求加一个拦截器(查看官方文档，npm axios包)
http.interceptors.response.use(res => {
    // 2. res做一件事情
    return res
}, err => {
    // 3. 如果报错了，err就是做另外一件事情。错误的请求，不是200状态码，>=400它都会进入err这里
    // console.log(err.name); // 看一下err.name是什么
    // console.log(err.response);  // err的错误对象上有个返回对象 响应对象
    // console.log(err.response.data); // err.response.data表示的是响应数据
    // console.log(err.response.data.message);
    // 如果我们以后跟服务端约定一个规则，如果服务端发生了报错，我们就统一返回一个json，
    // 里面有一个message表示或让客户端显示什么文字。那我们就可以在客户端里统一监听这个错误，

    // 4. 然后用Vue的prototype实例的$message.error去弹出这个错误
    // 这里是用elementui里的$message方法去显示一个提示
    // 因此这里就是一个通用的处理方案，当服务端返回了错误代码，而且有一个message的话，我们就把它拿出来

    // 5. 这里要保险点，再做点判断
    // 有内容的话，就自动弹出这个内容，那我们就不需要在每一个页面去监听有什么错误，再去弹出什么错误内容
    if (err.response.data.message) {
        Vue.prototype.$message({
            type: 'error',
            message: err.response.data.message
        })
    }
    
    return Promise.reject(err)
})


//导出变量
export default http