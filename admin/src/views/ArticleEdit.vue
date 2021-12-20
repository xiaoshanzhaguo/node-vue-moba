<template>
  <div class="categoryEdit">
    <h1>{{ id ? "编辑" : "新建" }}文章</h1>
    <el-form label-width="120px" @submit.native.prevent="save">
        <!-- 子分类 -->
      <el-form-item label="所属分类">
        <!-- 【文章管理】 1. 所属分类应该指定一个分类 
        这里要考虑一种情况，我们这里的这些文章，它按理说只属于某一个分类，但是同一篇文章有可能属于多个分类
        因此建立字段名字时，应该叫categories。并设置multiple-->
        <el-select v-model="model.categories" multiple>
            <!-- 【子分类】 1. 选项从哪里来？ -->
            <!-- 【子分类】 5. 循环展示数据 此时下面的parents是数据库里所有的分类 -->
            <!-- 【文章管理】 2. 改变数据来源  -->
            <el-option v-for="item in categories" :key="item._id"
            :label="item.name" :value="item._id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="标题">
        <el-input v-model="model.title"></el-input>
      </el-form-item>
      <!-- 【文章管理】 3. 加上详情字段  -->
      <el-form-item label="详情">
        <!-- 【富文本编辑器】5. 使用它后，上面就换成vue-editor，并更改v-model的值 -->
        <!-- 【富文本编辑器-图片上传】 1. -->
        <vue-editor v-model="model.body" useCustomImageHandler
       @image-added="handleImageAdded"></vue-editor>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" native-type="submit">保存</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
// 【富文本编辑器】1.这里是import解构的写法，如果不这么写，我们习惯性的可能就是下面第二种写法
// 【富文本编辑器】3.
// 而我们直接获取里面导出的子对象的话，那就是用解构的方式获取里面的VueEditor
import { VueEditor } from "vue2-editor"; 

// 【富文本编辑器】2.
// import a from 'vue2-editor'  a表示整个对象
// a.VueEditor  我们需要去获取a里面的VueEditor

export default {
  props: {
    id: {}, // 这里type:string不用去写
  },
  // 【富文本编辑器】4. 拿到之后把它加到components里面去。在这里加一个子组件，去使用VueEditor
  components: {
    VueEditor
  },
  data() {
    return {
      model: {},
    // 【子分类】 2. 父级的选项，暂时是空数组
      // parents: []
      // 【文章管理】 2. 改变数据来源 这里建立一个空数组就可以了。
      categories: []
    };
  },
  methods: {
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

        // 【文章管理】 3. 还需要改接口
        res = await this.$http.put(`rest/articles/${this.id}`, this.model);
      } else {
        // 下面这是新增操作
        // eslint-disable-next-line
        res = await this.$http.post("/rest/articles", this.model);
      }
      // 3.得到res后，创建完跳转到分类列表 !!!注意下面是跳转，不用加rest
      this.$router.push("/articles/list");
      // 4.跳转的时候，还要提示一个message
      this.$message({
        type: "success",
        message: "保存成功",
      });
    },
    async fetch() {
      // 2. 去请求这个接口
      const res = await this.$http.get(`rest/articles/${this.id}`); // 这个接口暂时不知道，因此又要去后端写接口
      this.model = res.data;
    },
    // 【子分类】 3. 获取父级的选项

    // 【文章管理】 4. 修改方法名 在文章这里需要选择分类，就需要先获取分类
    async fetchCategories() {
    // 【子分类】 因为数据是从后台接口过来，需要写一个接口，很明显在不考虑多的情况下，数据就是接口列表的数据
    //  当然也可以专门写一个接口用来显示父级的选项 xxx.get(`articles/parent-options`) 然后我们在后端定义一个路由即可
    // 但是现在比较简单的做法就是直接使用分类列表的接口
      const res = await this.$http.get(`rest/categories`);  //之前加接口地址，这里没填写对，没加rest
      this.categories = res.data;
    },

    // 【富文本编辑器-图片上传】 2. 我们用的是比较新的ES6语法，因此: function可以省略
    // 在这里面可以看到它使用了接口请求，所以我们在外层，为了方便加async，在里面可以使用await，
    // 把异步的请求写成同步的形式

    // 【富文本编辑器-图片上传】 4. 这个就是我们自定义的上传器
    async handleImageAdded(file, Editor, cursorLocation, resetUploader) {

      // 一开始先定义一个表单数据 FormData是在html里自带的一个类，可以用来提交表单数据。
      // 有两种方式提交数据：表单数据、json数据。平时我们用的是Json数据，但是因为这里要上传文件，故提交表单数据。
      const formData = new FormData();
      // appen是添加什么字段，file是选择的文件对象，我们在这里只需要改变上传的文件字段是哪个。
      // 我们之前做图片上传时，查看返回的数据时，名称就是file，值是binary二进制文件
      // 因为在服务端接收的也是file。（index.js里）
      formData.append("file", file);

      // 【富文本编辑器-图片上传】 3.
      // 一个axios发起的请求，我们还是用自带的http发起请求。请求方法是post，上传地址是upload，formData是上传的数据，
      // 它会返回一个结果，比如说res = xxx 请求它 我们把它改造成一行的写法。
      // 原本我们是要写下面的axios这么多内容，改造后只要写一行数据，得到了res，就是下面的result。
      // 得到了res后，我们知道res.data.url表示文件的一个url，所以有了下面的代码。
      const res = await this.$http.post('upload', formData)
      // 虽然现在还不知道它的意思，但是看它的样子就是拿到url之后，就用insertEmbed。Editor是个编辑器对象。
      // 大致意思是插入一个元素，cursorLocation是光标的位置。光标位置插入一张图片，图片地址是res.data.url
      Editor.insertEmbed(cursorLocation, "image", res.data.url);
       // 重置上传器（上传文件的东西）
      resetUploader();
    }
  },
  created() {
    // 【子分类】 4. 在创建的时候，执行获取父级选项

    // 【文章管理】 4. 修改方法名 在文章这里需要选择分类，就需要先获取分类
    this.fetchCategories()
    // 1. 判断如果有了this.id 才执行 ...  && 前面的条件满足之后，才执行后面的方法
    this.id && this.fetch();
  },
};
</script>