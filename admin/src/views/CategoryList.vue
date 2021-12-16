<template>
  <div class="categoryList">
    <h1>分类列表</h1>
    <!-- 1. 表格需要提供一个表格的数据 -->
    <el-table :data="items">
      <el-table-column prop="_id" label="ID" width="230"></el-table-column>
      <el-table-column prop="name" label="分类名称"></el-table-column>
      <el-table-column fixed="right" label="操作" width="180">
        <template slot-scope="scope">
          <el-button type="text" size="small" 
          @click="$router.push(`/categories/edit/${scope.row._id}`)">编辑</el-button>
          <!-- scope.row表示当前这一行数据 路径里不加/的话就不是从根目录开始的 -->
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 2. 这里是一个空数据
      items: [],
    };
  },
  methods: {
    async fetch() {
      // 4.这里不知道分类接口是哪个，故进入服务端的index.js里面，把分类列表的接口写一下。
      // eslint-disable-next-line
      const res = await this.$http.get("categories");
      // 5.
      this.items = res.data;
    },
  },
  created() {
    // 3.这个组件默认进来要做什么事情，默认进来是要获取数据的，我们可以在这里直接去写，但是最好还是写一个methods，
    // 便于我们后面万一重新要调用它

    // 6.在created创建之后，自动执行fetch()
    this.fetch();
  },
};
</script>