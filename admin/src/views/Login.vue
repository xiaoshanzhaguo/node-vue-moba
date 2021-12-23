<template>
  <div class="login-container">
    <!-- 【登录界面】1. 里面可以用el-card来写 -->
    <el-card header="请先登录" class="login-card">
      <!-- 【登录界面】3. 在card里面写登录的表单  -->
      <!-- 【登录界面】5. v-model绑定数据  -->
      <!-- 【登录界面】6. 全部绑定后，点击登录的时候监听表单的submit 
      native表示监听el-from里原生表单的事件，prevent表示阻止表单的默认提交，不要跳转页面。执行的方法是login -->
      <el-form @submit.native.prevent="login">
        <el-form-item label="用户名">
          <el-input v-model="model.username"></el-input>
        </el-form-item>
        <el-form-item label="密码">
          <!-- 这里常规使用密码框 -->
          <el-input type="password" v-model="model.password"></el-input>
        </el-form-item>
        <el-form-item>
          <!-- 登录按钮 设置它的主要颜色 primary是主要颜色-->
          <el-button type="primary" native-type="submit">登录</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
// 【登录界面】4. 定义数据 习惯性得针对表单都定义Model
export default {
  data() {
    return {
      model: {}
    }
  },
  methods: {
    // 【登录界面】7. login方法  当我们点击登录后，需要请求一个接口
    async login() {
      // 这里先把this.model log出来看一下。
      // console.log(this.model);  //在页面中测试，console里发现，拿到了数据

      // 【登录接口】 1. 请求这个数据完成，得到的应该是个token。后续我们会把token保存起来
      // 3. post请求还要把当前的model传上去，因为里面包含了用户名和密码，因此把this.model当成第二个参数传给服务器。
      // 然后到接口请求下面，就能看到username和password两个数据传上来了。并且这里传的密码是明文。
      const res = await this.$http.post('login', this.model)
      // 2. 暂时还是输出一下res.data。把服务端返回的数据log看一下。
      // console.log(res.data);

      // 4. 下面是最简单的方法。这就表示把当前返回数据的token写入到localStorage里，是浏览器的一个存储，
      // 在浏览器关闭之后，还能继续访问得到，下次再打开它也有的，只要保证是同一个网址域名就行
      localStorage.token = res.data.token
      // 如果希望浏览器关闭就没有的话，用sessionStorage。它表示的是当前浏览器关掉之后就没了
      // sessionStorage.token = res.data.token

      // 5. 设置完之后，跳转到首页
      this.$router.push('/')
      // 6. 最好用一个this的message去弹出一个信息，登录成功
      this.$message({
        type: 'success',
        message: '登录成功'
      })
    }
  }
}
</script>


<style scoped>
/* 【登录界面】2. 调整卡片宽度 */
.login-card {
  width: 25rem;
  margin: 5rem auto;
}
</style>
