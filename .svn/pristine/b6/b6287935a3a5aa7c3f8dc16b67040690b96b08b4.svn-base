<template>
  <div class="delete-button">
    <el-popover placement="top" width="160" v-model="visible">
      <p>确定删除吗？</p>
      <div style="text-align: right; margin: 0">
        <el-button size="mini" type="text" @click="visible = false">取消</el-button>
        <el-button type="primary" size="mini" @click.prevent="handleDeleteItem">确定</el-button>
      </div>
      <i class="el-icon-close" slot="reference" @click.prevent.stop="visible = true"></i>
    </el-popover>
  </div>
</template>
<script>
import { DeleteTopic } from "@/api/topic.js";
import {  deleteColletion } from "@/api/mycollections.js";

export default {
  name: "DeleteIcon",
  props: {
    topicId: {
      type: [Number,String],
      default: null
    },
    deleteType: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      visible: false
    };
  },
  methods: {
    handleDeleteItem() {
      if (this.deleteType == "collection") {
        //删除收藏贴
        let ReplyIds = [this.topicId];
        deleteColletion(ReplyIds).then(res => {
          if (res.Success) {
            this.$message.success("移除成功");
            // this.getMyCollect();
            this.$emit('getMyCollect')
          } else {
            this.$message.warning(res.ErrMes);
          }
        });
      } else {
        //删除帖子
        DeleteTopic({ TopicId: this.topicId }).then(res => {
          this.visible = false;
          this.$message.success('删除成功')
          this.$emit("onFlashPage");
        });
      }
    }
  }
};
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
.delete-button {
  cursor: pointer;
  opacity: 0.5;
}
.delete-button:hover {
  opacity: 1;
}
</style>

