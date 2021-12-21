<template>
  <div class="itemEdit">
    <h1>{{ id ? "编辑" : "新建" }}物品</h1>
    <el-form label-width="120px" @submit.native.prevent="save">
      <el-form-item label="名称">
        <el-input v-model="model.name"></el-input>
      </el-form-item>
      <!-- 【图片上传】 1. -->
      <el-form-item label="图标">
        <!-- action（上传的接口地址） 字面理解是一个地址，类似表单的form的action，表单地址表示它提交到哪里
        上传图片是我们选择图片后，它会要发起一个异步请求去把图片传给某一个接口，然后在后端的接口去保存这张图片
        保存完后，并返回客户端一个图片的整个url网址，前端拿到响应后，把地址展示出来 -->
        <!-- http的defaults表示它的默认参数，里面有个baseURL 加上upload，我们假设有这么一个上传请求地址 -->
        <!-- !!!下面是动态绑定，因此要加: 里面的值是变量+upload-->
        <!-- 上面的基础地址是在http.js里定义好的，我们必须加一个完整的地址，否则由于它底层用的不是http实例，
        是用的自带的Ajax请求，请求地址就不对了。不加BaseURL,我们以为它会自动根据根地址去请求，但其实不会 -->

        <!-- on-success: 表示成功之后做什么 
        就是把它返回过来的值赋值给model.icon 服务端会返回一堆东西，把一堆东西里的表示图片地址的赋值给model.icon，
        它就能展示这张图片了，同时model.icon这个值也被赋值上去了-->
        <!-- before-upload：表示上传之前做什么 我们暂时不管它，可能会有上传的验证：大小合适否，尺寸和格式的问题等-->
        <el-upload
          class="avatar-uploader"
          :action="$http.defaults.baseURL + '/upload'"
          :show-file-list="false"
          :on-success="afterUpload"
        >
        <!-- imageUrL字段有的時候，就展示它。 src=xxx 很明显是把图片的地址放在这 我们需要把这里改成model.icon-->
        <!-- 这里要实现的地址意思是 在上传模块里有两个组件，一个图片，一个上传图标，
        如果有图片地址就显示图片，无就显示上传图标-->
          <img v-if="model.icon" :src="model.icon" class="avatar" />
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" native-type="submit">保存</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  props: {
    id: {}, // 这里type:string不用去写
  },
  data() {
    return {
      model: {},
    };
  },
  methods: {
    // 【图片上传】3. 函数接收一个参数res 表示服务端的响应（就是服务端返回的数据是什么）
    afterUpload(res) {
      // 由于我们不请求是什么值，我们先打印出来，暂时不做其他的操作。
      // console.log(res);
      // 显式赋值 第一个参数是你要赋值的主体，第二个是你要赋值的属性(表示你要给它添加或设置的属性)
      this.$set(this.model, 'icon', res.url)
      // this.model.icon = res.url
    },
    async save() {
      // 1.提交数据用post方法。
      // 2.发起请求，提交到categories接口 传递参数 平常我们可能用的是.shen方法，
      //   上面可以使用async，和后端一样 下面就可以用await去使用它 因为它也可以返回一个promise
      //   就可以把异步的回调函数的写法，写成类似同步的写法
      // 5.测试
      console.log("save");
      // eslint-disable-next-line
      let res; // eslint-disable-line no-unused-vars
      if (this.id) {
        // 下面这是修改操作
        // eslint-disable-next-line
        res = await this.$http.put(`rest/items/${this.id}`, this.model);
      } else {
        // 下面这是新增操作
        // eslint-disable-next-line
        res = await this.$http.post("/rest/items", this.model);
      }
      // 3.得到res后，创建完跳转到分类列表 !!!注意下面是跳转，不用加rest
      this.$router.push("/items/list");
      // 4.跳转的时候，还要提示一个message
      this.$message({
        type: "success",
        message: "保存成功",
      });
    },
    async fetch() {
      // 2. 去请求这个接口
      const res = await this.$http.get(`rest/items/${this.id}`); // 这个接口暂时不知道，因此又要去后端写接口
      this.model = res.data;
    },
  },
  created() {
    // 1. 判断如果有了this.id 才执行 ...  && 前面的条件满足之后，才执行后面的方法
    this.id && this.fetch();
  },
};
</script>