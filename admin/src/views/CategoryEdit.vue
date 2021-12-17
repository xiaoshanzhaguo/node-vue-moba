<template>
  <div class="categoryEdit">
    <h1>{{ id ? "编辑" : "新建" }}分类</h1>
    <el-form label-width="120px" @submit.native.prevent="save">
        <!-- 子分类 -->
      <el-form-item label="上级分类">
        <el-select v-model="model.parent">
            <!-- 【子分类】 1. 选项从哪里来？ -->
            <!-- 【子分类】 5. 循环展示数据 此时下面的parents是数据库里所有的分类 -->
            <el-option v-for="item in parents" :key="item._id"
            :label="item.name" :value="item._id"></el-option>
        </el-select>
      </el-form-item>
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
  props: {
    id: {}, // 这里type:string不用去写
  },
  data() {
    return {
      model: {},
    // 【子分类】 2. 父级的选项，暂时是空数组
      parents: []
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
        res = await this.$http.put(`categories/${this.id}`, this.model);
      } else {
        // 下面这是新增操作
        // eslint-disable-next-line
        res = await this.$http.post("categories", this.model);
      }
      // 3.得到res后，创建完跳转到分类列表
      this.$router.push("/categories/list");
      // 4.跳转的时候，还要提示一个message
      this.$message({
        type: "success",
        message: "保存成功",
      });
    },
    async fetch() {
      // 2. 去请求这个接口
      const res = await this.$http.get(`categories/${this.id}`); // 这个接口暂时不知道，因此又要去后端写接口
      this.model = res.data;
    },
    // 【子分类】 3. 获取父级的选项
    async fetchParents() {
    // 【子分类】 因为数据是从后台接口过来，需要写一个接口，很明显在不考虑多的情况下，数据就是接口列表的数据
    //  当然也可以专门写一个接口用来显示父级的选项 xxx.get(`categories/parent-options`) 然后我们在后端定义一个路由即可
    // 但是现在比较简单的做法就是直接使用分类列表的接口
      const res = await this.$http.get(`categories`);
      this.parents = res.data;
    },
  },
  created() {
    // 【子分类】 4. 在创建的时候，执行获取父级选项
    this.fetchParents()
    // 1. 判断如果有了this.id 才执行 ...  && 前面的条件满足之后，才执行后面的方法
    this.id && this.fetch();
  },
};
</script>