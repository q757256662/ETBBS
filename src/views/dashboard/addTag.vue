<template>
  <el-card class="dashboard-container">
    <!-- addTag 自定义标签 -->
    <!-- <h3 style="text-align:center;margin-bottom:20px;font-weight:600">标签</h3> -->
    <div class="form_box">
      <!-- <el-tag :key="tag.Id" v-for="tag in dynamicTags" :disable-transitions="false">
        <span >{{tag.name}}</span>
      </el-tag>-->

      <!-- <el-button v-else class="button-new-tag" size="small" >+ </el-button> -->
      <el-card class="box-card" v-loading="loading">
        <div slot="header" class="clearfix">
          <span>标签名称</span>
          <el-button
            style="float: right; padding: 3px 0"
            type="text"
            @click="()=>{this.createTagVisible = true}"
          >新增标签</el-button>
        </div>
        <div v-for="item in dynamicTags" :key="item.Id">
          <p style="margin-bottom:10px;">
            <el-tag>{{item.name}}</el-tag>
            <el-button size="small" style="float:right;" @click="handleEdit(item)">编辑</el-button>
          </p>
          <el-input
            class="input-new-tag"
            v-if="inputVisible"
            v-model="inputValue"
            ref="saveTagInput"
            size="small"
            @keyup.enter.native="handleInputConfirm"
            @blur="handleInputConfirm"
          ></el-input>
        </div>
      </el-card>
      <!-- <el-input
  class="input-new-tag"
  v-if="editInputVisible"
  v-model="newInputValue"
  placeholder="请输入新的标签名"
  ref="editTagInput"
  size="small"
  @keyup.enter.native="handleInputEdit"
  @blur="handleInputEdit"
>
      </el-input>-->
    </div>
    <!-- 修改tag -->
    <el-dialog title="修改" :visible.sync="editInputVisible" width="30%">
      <el-form>
        <el-form-item label="标签名称:" :label-width="formLabelWidth">
          <el-input placeholder="请输入新的标签名" v-model="newInputValue" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editInputVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleInputEdit">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="新增标签" :visible.sync="createTagVisible" width="30%">
      <el-form>
        <el-form-item label="标签名称:" :label-width="formLabelWidth">
          <el-input placeholder="请输入新的标签名" v-model="inputValue" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="createTagVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleInputConfirm">确 定</el-button>
      </div>
    </el-dialog>
  </el-card>
</template>

<script>
import { mapGetters, mapState } from "vuex";
import { getTag, addTag, editTag } from "@/api/addtag.js";

export default {
  name: "dashboard",
  computed: {
    ...mapGetters(["name", "roles"]),
    ...mapState({
      user: state => state.user
    })
  },
  created() {
    this.initData();
  },
  data() {
    return {
      userMessage: {}, //用户信息
      dynamicTags: [],
      inputVisible: false,
      inputValue: "",
      newInputValue: "",
      editInputVisible: false,
      tagId: "",
      formLabelWidth: "80px",
      createTagVisible: false, //新增标签模态框
      loading:false
    };
  },
  methods: {
    /**初始化数据 */
    initData() {
      //   console.log(this.user);
      this.loading = true
      getTag().then(res => {
        //    console.log(res);
      this.loading = false
        if (res.Success) {
          this.dynamicTags = res.Data.Rows;
        }
      });
    },

    handleEdit(tag) {
      this.tagId = tag.Id;
      this.newInputValue = tag.name;
      this.editInputVisible = true;
    },
    //删除标签
    handleClose(tag) {
      this.dynamicTags.splice(this.dynamicTags.indexOf(tag), 1);
    },
    //确定添加标签
    handleInputConfirm() {
      let inputValue = this.inputValue;
      let form = {};
      form.name = inputValue;
      if (inputValue) {
        addTag(form).then(res => {
          if (res.Success) {
            this.initData();
            this.$message.success("成功");
            this.inputVisible = false;
            this.createTagVisible = false;
            this.inputValue = "";
          } else {
            this.$message.warning(res.ErrMes);
          }
        });
      }
    },
    handleInputEdit() {
      let inputValue = this.newInputValue;
      let form = {};
      form.name = inputValue;
      form.Id = this.tagId;
      form.UserId = this.user.userinfo.id;
      if (inputValue) {
        //   this.dynamicTags.push(inputValue);
        editTag(form).then(res => {
          if (res.Success) {
            this.initData();
            this.newInputValue = "";
            this.editInputVisible = false;
            this.$message.success("成功");
          } else {
            this.$message.warning(res.ErrMes);
          }
        });
      }
    }
  }
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.dashboard {
  &-container {
    // width: 500px;
    // margin-left:400px;
    // margin: 50px auto 0px;
    // background:#efefef;
    // text-align: center;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
.form_box {
  // border:1px solid red;
  width: 400px;
  margin: 0 auto;
  // height: 500px;
  // padding:50px 20px;
  // background:#eee;
}
.el-tag + .el-tag {
  margin-left: 10px;
}
.button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}
.input-new-tag {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
}
</style>
