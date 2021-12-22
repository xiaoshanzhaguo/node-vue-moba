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
  method: {
    // 【登录界面】7. login方法  当我们点击登录后，需要请求一个接口
    login() {
      // 这里先把this.model log出来看一下。
      console.log(this.model);  //在页面中测试，console里发现，拿到了数据
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
