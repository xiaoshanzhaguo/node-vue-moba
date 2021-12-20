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
        <vue-editor v-model="model.body"></vue-editor>
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