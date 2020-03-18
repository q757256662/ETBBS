<template>
  <div class="card-main">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <div style="line-height: 45px;margin-right: 18px;">
          <!-- <el-checkbox style="margin:0 7px 0 8px;" :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox> -->
        </div>
        <!-- <span>卡片名称</span> -->
        <!-- <el-button  type="text">操作按钮</el-button> -->
        <div>
          <el-input
            v-if="type!='link'"
            placeholder="搜索"
            style="float: right; padding: 3px 0;width:200px;"
            size="mini"
            @change="handleSearch"
            @input="handleSearch"
          ></el-input>
        </div>
      </div>
      <div v-if="type=='link'">
        <div v-if="inviteListReplace.length==0">
          <div style="text-align:center">暂无信息</div>
        </div>
        <div v-for="item in inviteListReplace" :key="item.TopicId" class="text item" v-else>
          <span class="title" :title="item.TopicTitle">{{item.TopicTitle}}</span>
          <el-button size="mini" @click="handleInviteReply(item)">复制链接</el-button>
        </div>
      </div>
      <div v-else>
        <div
          @click="changeChecked(item,index)"
          v-for="(item,index) in inviteListReplace"
          :key="item.UserId"
          class="text item"
        >
          <!-- <svg-icon :icon-class="changeClass(index)"></svg-icon> -->

          <el-checkbox-group v-model="checkedArr" @change="handleCheckedChange($event,item,index)">
            <el-checkbox :label="item" :value="item" :key="index">{{item.UserName}}</el-checkbox>
            <!-- <el-button type="mini" @click="handleInviteUser(item,index)">邀请</el-button> -->
          </el-checkbox-group>
        </div>
      </div>
    </el-card>
    <div v-if="type!='link'" class="foot-btn">
      <span slot="footer" class="dialog-footer">
        <!-- <el-button @click="inviteDialog = false">取 消</el-button> -->
        <el-button
          style="margin:0 7px 0 8px;"
          v-if="type!='link'"
          type="primary"
          @click="handleInviteUser"
        >邀请</el-button>
        <!-- <el-button type="primary" @click="inviteDialog = false">确 定</el-button> -->
      </span>
    </div>
  </div>
</template>
<script>
export default {
  name: "inviteList",
  props: {
    inviteList: Array,
    type: String
  },
  data() {
    return {
      // inviteListReplace: this.$props.inviteList,
      checkIndex: "-1",
      checkClass: "unchecked",
      checkAll: false,
      checkedArr: [],
      isIndeterminate: true,
      checkItem: []
    };
  },
  computed: {
    inviteListReplace() {
      return this.$props.inviteList;
    }
  },
  created() {
    // console.log(this.inviteListReplace);
    this.checkedArr = [];
  },
  methods: {
    /**复制链接 */
    handleInviteReply(topic) {
      // console.log(topic)
      // this.inviteListReplace.splice(index,1)
      this.$emit("onInvite", topic);
    },
    changeChecked(row, index) {
      this.checkIndex = index;
    },
    handleCheckAllChange(val) {
      this.isIndeterminate = false;
      this.checkedArr = val ? this.inviteListReplace : [];
    },
    handleCheckedChange(value, item, index) {
      // console.log(value)
      // console.log(item)
      //  console.log(index)
      this.checkIndex = index;
      let checkedCount = value.length;
      this.checkAll = checkedCount === this.inviteListReplace.length;
      this.isIndeterminate =
        checkedCount > 0 && checkedCount < this.inviteListReplace.length;
    },
    handleSearch(val) {
      // console.log(val)
      // console.log(this.inviteListReplace);
      if (this.type == "invite") {
        this.inviteListReplace = this.$props.inviteList.filter(el => {
          return el.UserName.includes(val);
        });
      } else {
        this.inviteListReplace = this.$props.inviteList.filter(el => {
          return el.TopicTitle.includes(val);
        });
      }
    },
    /**邀请用户回答 */
    handleInviteUser(user, index) {
      // console.log(this.checkItem);
      console.log(this.checkedArr);
      if (this.checkedArr.length == 0) {
        this.$message.warning("请选择邀请用户");
      } else {
        this.$emit("onInviteUser", this.checkedArr);
      }
      // this.inviteListReplace.splice(this.checkIndex,1)
    }
  }
};
</script>
<style scoped rel="stylesheet/scss" lang="scss">
.text {
  font-size: 14px;
}

.text .title {
  display: inline-block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  width: 200px;
}

.item {
  /* padding-bottom: 18px;
    margin-bottom:5px;
    padding-top:5px; */
  height: 40px;
  line-height: 40px;
  border-bottom: 1px solid #eee;
}

.item .el-button {
  float: right;
  margin-top: 5px;
}
.clearfix {
  display: flex;
  justify-content: flex-start;
  line-height: 40px;
}
.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}
.clearfix:after {
  clear: both;
}
.card-main /deep/ .el-card__header {
  /* width: 480px; */
  padding: 5px 0px;
}
.card-main /deep/ .el-card__body {
  padding: 6px;
  min-height: 250px;
  max-height: 540px;
  height: auto;
  overflow-y: auto;
}
.foot-btn {
  padding: 10px 20px 20px;
  text-align: right;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
}
</style>