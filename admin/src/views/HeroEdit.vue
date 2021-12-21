<template>
  <div class="heroEdit">
    <h1>{{ id ? "编辑" : "新建" }}英雄</h1>
    <el-form label-width="120px" @submit.native.prevent="save">
      <!-- 【技能编辑-UI】 1. -->
      <!-- 给它换一个样式 -->
      <el-tabs value="skills" type="border-card">
        <!-- label是它上面显示的文字 name 起了一个名字后 在el-tabs里面指定一个value表示哪一个默认显示，不写的话默认是第一个-->
        <el-tab-pane label="基本信息" name="basic">
          <el-form-item label="名称">
            <el-input v-model="model.name"></el-input>
          </el-form-item>
          <el-form-item label="称号">
            <el-input v-model="model.title"></el-input>
          </el-form-item>
          <!-- 【图片上传】 1. -->
          <el-form-item label="头像">
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
              <img v-if="model.avatar" :src="model.avatar" class="avatar" />
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
          </el-form-item>
          <el-form-item label="类型">
            <el-select v-model="model.categories" multiple>
              <!-- 【英雄编辑】1. 从分类这个变量里去循环出来 还要指定label和value 同时每个for循环要加一个key，给它唯一的字段-->
              <el-option
                v-for="item of categories"
                :key="item._id"
                :label="item.name"
                :value="item._id"
              ></el-option>
            </el-select>
          </el-form-item>
          <!-- 【英雄编辑】5. -->
          <el-form-item label="难度">
            <el-rate
              style="margin-top: 0.6rem"
              :max="9"
              show-score
              v-model="model.scores.difficult"
            ></el-rate>
          </el-form-item>
          <!-- 【英雄编辑】9. -->
          <el-form-item label="技能">
            <el-rate
              style="margin-top: 0.6rem"
              :max="9"
              show-score
              v-model="model.scores.skills"
            ></el-rate>
          </el-form-item>
          <el-form-item label="攻击">
            <el-rate
              style="margin-top: 0.6rem"
              :max="9"
              show-score
              v-model="model.scores.attack"
            ></el-rate>
          </el-form-item>
          <el-form-item label="生存">
            <el-rate
              style="margin-top: 0.6rem"
              :max="9"
              show-score
              v-model="model.scores.survive"
            ></el-rate>
          </el-form-item>
          <el-form-item label="顺风出装">
            <!-- 下面的装备是从items里获取，而不是items1。当然items也需要去建立一个数据。在下面是一个空数组，然后从服务端获取它 -->
            <el-select v-model="model.items1" multiple>
              <el-option
                v-for="item of items"
                :key="item._id"
                :label="item.name"
                :value="item._id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="逆风出装">
            <el-select v-model="model.items2" multiple>
              <el-option
                v-for="item of items"
                :key="item._id"
                :label="item.name"
                :value="item._id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="使用技巧">
            <!-- 这样就能使用大的文本框去编辑内容了。这里的文本文字可能有点多，如果用普通的文本框可能会有点不方便 -->
            <el-input type="textarea" v-model="model.usageTips"></el-input>
          </el-form-item>
          <el-form-item label="对抗技巧">
            <el-input type="textarea" v-model="model.battleTips"></el-input>
          </el-form-item>
          <el-form-item label="团战思路">
            <el-input type="textarea" v-model="model.teamTips"></el-input>
          </el-form-item>
        </el-tab-pane>
        <!-- 给技能默认高亮 -->
        <el-tab-pane label="技能" name="skills">
          <!-- 写一个添加的图标，如果觉得图标太大，就设置type，这样就会变成纯文字的图标。
          最后还是用默认的按钮比较好，因此去掉了type。并将size小一点 -->
          <!-- 【技能编辑-UI】 2.4 因此在添加技能时，在这上面加一个@click 
          从数据的角度出发，我们就是给model.skills里添加一个元素
          这样子就相当于本来skills是一个空数组，点击后，就添加了空对象，它就有一个元素了-->
          <el-button size="samll" @click="model.skills.push({})"><i class="el-icon-plus">
            </i> 添加技能
          </el-button>
          <!-- 【技能编辑-UI】 2.1 下面是让它显示为flex布局-->
          <!-- 【技能编辑-UI】 2.6 因为它是flex布局，默认没有换行，我们就要加style-->
          <el-row type="flex" style="flex-wrap: wrap;">
          <!-- 【技能编辑-UI】 2.2 -->
          <!-- 用el-col去定义一列 它的宽度在中等屏幕(普通电脑屏幕)上md，就是一行展示两个空。到时候添加的话，一行就有两个技能-->

          <!-- 【技能编辑-UI】 2.3 -->          
          <!-- el-row不是循环的，el-col是循环的，因此el-col要绑定一个数组的的数据 
          因为我们要点添加，就往数据里添加一条，每个数据多一条，el-col也应该多一个-->
          <!-- model.skills表示的是英雄的所有技能 key要绑定一个唯一字段（在这里面，名称是唯一的，用这个比较合适，
          但是考虑一开始名称可能为空，不太合适，所以item就要变成 item, i。i表示要取for循环的索引值，而key直接绑定到索引值上）-->
            <el-col :md="12" v-for="(item, i) in model.skills" :key="i">
              <!-- 在这里面还是该写什么写什么 -->
              <el-form-item label="名称">
                <el-input v-model="item.name"></el-input>
              </el-form-item>
              <!-- 【技能编辑-UI】 2.7 添加其他的元素 -->
              <el-form-item label="图标">
              <!-- 【技能编辑-UI】 2.8 这里的图标应该是当前添加技能的图标。
              model.skills表示的是技能的数组，这里面有icon等属性，因此为其他的输入框或上传修改v-model的值 -->

              <!-- 【技能编辑】1. 修改图片上传后进行什么操作 
              写一个函数接收一个res，要做的事情就是把res.url赋值到item.icon上。-->
                <el-upload
              class="avatar-uploader"
              :action="$http.defaults.baseURL + '/upload'"
              :show-file-list="false"
              :on-success="res => $set(item, 'icon', res.url)"
            >
              <img v-if="item.icon" :src="item.icon" class="avatar" />
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
              </el-form-item>
              <el-form-item label="描述">
                <el-input v-model="item.description" type="textarea"></el-input>
              </el-form-item>
              <el-form-item label="小提示">
                <el-input v-model="item.tips" type="textarea"></el-input>
              </el-form-item>
              <el-form-item>
                <!-- 下面的splice是针对数组进行切片，本意是在数组里把里面的部分删掉。 
                第一个是指定要删除的位置（我们这里是在for循环里面的，因此就是i。）
                从i这个位置开始，删除一个。-->
                <el-button size="small" type="danger" @click="model.skills.splice(i, 1)">删除</el-button>
              </el-form-item>
            </el-col>
          </el-row>
        </el-tab-pane>
      </el-tabs>
      <!-- 跟上面有一点的距离 -->
      <el-form-item style="margin-top: 1rem;">
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
      // 【英雄编辑】 2.分类数据不存在，暂时定义一个空数组，到时候从服务端把它请求过来
      categories: [],
      // 【英雄编辑】 10.
      items: [],
      model: {
        // 【英雄管理】 1.之前是因为在model里，什么属性都没有写/定义，所以再这里上传一个文件时，对于model来说，icon是新增的一个属性
        // 就没有响应式,除了用set这个方法，另外更好的方法是在这里把需要的属性全部加上。
        name: "", //默认是空的
        avatar: "",
        // 【英雄编辑】 6.分数定义成空对象，保证它必须存在
        scores: {
          // 【英雄编辑】 8.定义难度
          difficult: 0,
        },
        // 【技能编辑-UI】 2.5 要添加一个空的skills
        skills: []
      },
    };
  },
  methods: {
    // 【图片上传】3. 函数接收一个参数res 表示服务端的响应（就是服务端返回的数据是什么）
    afterUpload(res) {
      // 由于我们不请求是什么值，我们先打印出来，暂时不做其他的操作。
      // console.log(res);
      // 显式赋值 第一个参数是你要赋值的主体，第二个是你要赋值的属性(表示你要给它添加或设置的属性)
      // this.$set(this.model, 'avatar', res.url)

      // 【英雄管理】 2.在进行了上面的默认属性添加后，我们就可以使用普通的方式进行赋值了。
      // !!!建议在model里面把需要的数据先全部统一定义好。之前在ItemEdit里就model没定义数据，因此才要用显示赋值。
      this.model.avatar = res.url;
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
        res = await this.$http.put(`rest/heroes/${this.id}`, this.model);
      } else {
        // 下面这是新增操作
        // eslint-disable-next-line
        res = await this.$http.post("/rest/heroes", this.model);
      }
      // 3.得到res后，创建完跳转到分类列表 !!!注意下面是跳转，不用加rest
      this.$router.push("/heroes/list");
      // 4.跳转的时候，还要提示一个message
      this.$message({
        type: "success",
        message: "保存成功",
      });
    },
    async fetch() {
      // 2. 去请求这个接口
      const res = await this.$http.get(`rest/heroes/${this.id}`); // 这个接口暂时不知道，因此又要去后端写接口
      // this.model = res.data;
      // 【英雄编辑】 7. assign里的参数，第一个是空对象，可以简单理解为它是一个对象属性的合并；
      // 第二个现有的默认数据，第三个是服务端获取到的数据
      // 这种形式就会优先将this.model的值添加到空对象里去，然后再把res.data里的值添加进去
      // 这样的话，如果一开始this.model里已经有了scores，空对象里就会存在，
      // 后面res.data里没有scores，它就不会完整替换this.model。而是res里面有什么数据，就会把这些数据一个个赋值上去。
      // 这样就能保证我们得到的所有属性是 this.model + res.data 的东西
      // 如果有同名的，res.data会覆盖掉this.model，如果res.data有些数据没有，它就不会影响现有的默认数据 this.model
      this.model = Object.assign({}, this.model, res.data);
    },

    // 【英雄编辑】 3.
    async fetchCategories() {
      const res = await this.$http.get(`rest/categories`);
      // 【英雄编辑】 5.但是我们这里调的分类默认是全部都有，到时候只要里面的英雄分类，所以这个后面会处理一下。
      this.categories = res.data;
    },

    // 【英雄编辑】 11. 因为所有的选项都必须通过另外一个接口去获取过来。
    // !!!注意在创建的时候，一定要请求数据，否则前端就不显示想要的数据了。
    async fetchItems() {
      const res = await this.$http.get(`rest/items`);
      this.items = res.data;
    },
  },
  created() {
    // 【英雄编辑】 4.
    this.fetchCategories();
    // 【英雄编辑】 12.
    this.fetchItems();
    // 1. 判断如果有了this.id 才执行 ...  && 前面的条件满足之后，才执行后面的方法
    this.id && this.fetch();
  },
};
</script>