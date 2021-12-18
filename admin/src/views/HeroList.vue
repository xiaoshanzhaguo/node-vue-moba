<template>
  <div class="heroList">
    <h1>英雄列表</h1>
    <!-- 1. 表格需要提供一个表格的数据 -->
    <el-table :data="items">
      <el-table-column prop="_id" label="ID" width="230"></el-table-column>
      <!-- 【上传图片】1. -->
      <el-table-column prop="name" label="英雄名称"></el-table-column>
      <el-table-column prop="avatar" label="图标">
        <!-- 【上传图片】2. 在这里面用一个template 查看element-ui里有关table这块的内容，可以自定义这个字段里是怎么显示内容的-->
        <template slot-scope="scope">
          <!--【上传图片】3. 在这里面，想写什么写什么 -->
          <!-- scope.row 表示这行数据  3rem表示3个字的高度-->
          <img :src="scope.row.avatar" alt="" style="height:3rem;">
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="操作" width="180">
        <template slot-scope="scope">
          <el-button type="text" size="small" 
          @click="$router.push(`/heroes/edit/${scope.row._id}`)">编辑</el-button>
          <!-- scope.row表示当前这一行数据 路径里不加/的话就不是从根目录开始的 -->
          <!-- 2.1 删除按钮 -->
          <el-button type="text" size="small"
          @click="remove(scope.row)">删除</el-button>
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
      const res = await this.$http.get("rest/heroes");
      // 5.
      this.items = res.data;
    },
    // 2.2 remove方法，由于这个方法也使用了接口，因此要用async，接收一个参数row，表示这一行的数据
    async remove(row) {
        // 2.3 我们可以直接去请求接口，但是建议做删除时多加一个提示框 
        // 使用Element-ui里的message box .catch里面的取消删除就不用管它了
        this.$confirm(`是否确定要删除分类 "${row.name}"`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
            // 2.4 then里面表示的是它选择了一定要删除，在这里面定义一个res去请求接口
            // eslint-disable-next-line
            const res = await this.$http.delete(`rest/heroes/${row._id}`)  //注意这里是下划线id，指定它去删除
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
          // 2.5 删除成功后，还需要重新获取数据 (注意位置，别放到外层了)
            this.fetch()
        })
    }
  },
  created() {
    // 3.这个组件默认进来要做什么事情，默认进来是要获取数据的，我们可以在这里直接去写，但是最好还是写一个methods，
    // 便于我们后面万一重新要调用它

    // 6.在created创建之后，自动执行fetch()
    this.fetch();
  },
};
</script>