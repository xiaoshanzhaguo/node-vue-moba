<template>
    <div class="categoryEdit">
        <h1>新建分类</h1>
        <el-form label-width="120px" @submit.native.prevent="save">
            <el-form-item label="名称">
                <el-input v-model="model.name"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" native-type="submit">保存</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
export default {
    data() {
        return {
            model: {}
        }
    },
    methods: {
        async save() {
            // 1.提交数据用post方法。
            // 2.发起请求，提交到categories接口 传递参数 平常我们可能用的是.shen方法，
            //   上面可以使用async，和后端一样 下面就可以用await去使用它 因为它也可以返回一个promise
            //   就可以把异步的回调函数的写法，写成类似同步的写法
            // 5.测试
            console.log('save');
             // eslint-disable-next-line
            const res = await this.$http.post('categories', this.model) 
            // 3.得到res后，创建完跳转到分类列表
            this.$router.push('/categories/list')
            // 4.跳转的时候，还要提示一个message
            this.$message({
                type: 'success',
                message: '保存成功'
            })
        }
    }
}
</script>