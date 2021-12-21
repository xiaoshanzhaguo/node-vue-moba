<template>
  <div class="categoryEdit">
    <h1>{{ id ? "编辑" : "新建" }}分类</h1>
    <el-form label-width="120px" @submit.native.prevent="save">
      <el-form-item label="名称">
        <el-input v-model="model.name"></el-input>
      </el-form-item>
      <!-- 【广告管理】4. 添加一个el-form-item 并添加label -->
      <el-form-item label="广告">
        <!-- 【广告管理】1. -->
        <el-button size="samll" @click="model.items.push({})"
          ><i class="el-icon-plus"> </i> 添加广告
        </el-button>
        <!-- 【技能编辑-UI】 2.1 下面是让它显示为flex布局-->
        <!-- 【技能编辑-UI】 2.6 因为它是flex布局，默认没有换行，我们就要加style-->
        <el-row type="flex" style="flex-wrap: wrap">
          <!-- 【技能编辑-UI】 2.2 -->
          <!-- 用el-col去定义一列 它的宽度在中等屏幕(普通电脑屏幕)上md，就是一行展示两个空。到时候添加的话，一行就有两个技能-->

          <!-- 【技能编辑-UI】 2.3 -->
          <!-- el-row不是循环的，el-col是循环的，因此el-col要绑定一个数组的的数据 
          因为我们要点添加，就往数据里添加一条，每个数据多一条，el-col也应该多一个-->
          <!-- model.items表示的是英雄的所有技能 key要绑定一个唯一字段（在这里面，名称是唯一的，用这个比较合适，
          但是考虑一开始名称可能为空，不太合适，所以item就要变成 item, i。i表示要取for循环的索引值，而key直接绑定到索引值上）-->

          <!-- 【广告管理】 -->
          <el-col :md="24" v-for="(item, i) in model.items" :key="i">
            <!-- 在这里面还是该写什么写什么 -->

            <!-- 【广告管理】5. 跳转链接  -->
            <el-form-item label="跳转链接（url）">
              <el-input v-model="item.url"></el-input>
            </el-form-item>
            <!-- 【技能编辑-UI】 2.7 添加其他的元素 -->

            <!-- 【广告管理】6. 图片上面没间距，要修改样式  -->
            <el-form-item label="图片" style="margin-top: 0.5rem;">
              <!-- 【技能编辑-UI】 2.8 这里的图标应该是当前添加技能的图标。
              model.items表示的是技能的数组，这里面有icon等属性，因此为其他的输入框或上传修改v-model的值 -->

              <!-- 【技能编辑】1. 修改图片上传后进行什么操作 
              写一个函数接收一个res，要做的事情就是把res.url赋值到item.icon上。-->
              <el-upload
                class="avatar-uploader"
                :action="$http.defaults.baseURL + '/upload'"
                :show-file-list="false"
                :on-success="(res) => $set(item, 'image', res.url)"
              >
                <img v-if="item.image" :src="item.image" class="avatar" />
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
              </el-upload>
            </el-form-item>
            <el-form-item>
              <!-- 下面的splice是针对数组进行切片，本意是在数组里把里面的部分删掉。 
                第一个是指定要删除的位置（我们这里是在for循环里面的，因此就是i。）
                从i这个位置开始，删除一个。-->
              <el-button
                size="small"
                type="danger"
                @click="model.items.splice(i, 1)"
                >删除</el-button
              >
            </el-form-item>
          </el-col>
        </el-row>
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
      model: {
        // 【广告管理】2. 因为我们model定义的时候是个空对象，在model里应该加个items，
        // 默认是个空数组，这样我们才能往里面加东西。
        items: [],
      },
    };
  },
  methods: {
    async save() {
      // 1.提交数据用post方法。
      // 2.发起请求，提交到ads接口 传递参数 平常我们可能用的是.shen方法，
      //   上面可以使用async，和后端一样 下面就可以用await去使用它 因为它也可以返回一个promise
      //   就可以把异步的回调函数的写法，写成类似同步的写法
      // 5.测试
      console.log("save");
      // eslint-disable-next-line
      let res; // eslint-disable-line no-unused-vars
      if (this.id) {
        // 下面这是修改操作
        // eslint-disable-next-line
        res = await this.$http.put(`rest/ads/${this.id}`, this.model);
      } else {
        // 下面这是新增操作
        // eslint-disable-next-line
        res = await this.$http.post("/rest/ads", this.model);
      }
      // 3.得到res后，创建完跳转到分类列表 !!!注意下面是跳转，不用加rest
      this.$router.push("/ads/list");
      // 4.跳转的时候，还要提示一个message
      this.$message({
        type: "success",
        message: "保存成功",
      });
    },
    async fetch() {
      // 2. 去请求这个接口
      const res = await this.$http.get(`rest/ads/${this.id}`); // 这个接口暂时不知道，因此又要去后端写接口
      // this.model = res.data;
      // 【广告管理】3. 把服务端的数据合并到this.model上，最终合成一个新的，
      // 这样如果服务端返回的数据没有items，它不会把这个items删除掉。
      this.model = Object.assign({}, this.model, res.data);
    },
  },
  created() {
    // 1. 判断如果有了this.id 才执行 ...  && 前面的条件满足之后，才执行后面的方法
    this.id && this.fetch();
  },
};
</script>