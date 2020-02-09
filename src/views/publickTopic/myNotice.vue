<template>
  <div class="my-notice">
    <el-tabs v-model="activeName" @tab-click="handleClick" type="border-card">
      <el-tab-pane label="程序更新" name="UpdateTopics">
        <div v-if="UpdateTopics.length!=0">
          <div class="table-header">
            <div class="check" @click.stop="handleCheck">
              <!-- {{topicItem.KeyFileIds.substring(0,1) }} -->
              <svg-icon icon-class="checked" v-if="checkState"></svg-icon>
              <svg-icon icon-class="unchecked" v-else></svg-icon>
            </div>
            <span class="table-title">
              <span v-if="checkBox.length==0">标题</span>
              <span v-else>
                <el-select v-model="moveSelect">
                  <el-option key=2 label="疑问解答" value=2></el-option>
                  <el-option key=0 label="其他" value=0></el-option>
                </el-select>
                <el-button @click="handleMoveTopic">移动</el-button>
                <el-button @click="handleSetting">设置</el-button>
              </span>
            </span>
            <span class="table-limitScore">限制分</span>
            <span class="table-type">类型</span>
            <span class="table-createTime">创建时间</span>
          </div>
          <noticeItem
            v-for="item in UpdateTopics"
            :key="item.id"
            :item="item"
            @flashPage="initData"
            @onSettingCheck="handleSettingCheck"
            :parentCheckState="(checkState&&activeName=='UpdateTopics')"
          ></noticeItem>
        </div>
        <noItem v-loading="loadingState" v-else></noItem>
      </el-tab-pane>
      <el-tab-pane label="疑问解答" name="DiffTopics">
        <div class="table-header">
          <div class="check" @click.stop="handleCheck">
            <!-- {{topicItem.KeyFileIds.substring(0,1) }} -->
            <svg-icon icon-class="checked" v-if="checkState"></svg-icon>
            <svg-icon icon-class="unchecked" v-else></svg-icon>
          </div>
          <span class="table-title">
            <span v-if="checkBox.length==0">标题</span>
            <span v-else>
              <el-select v-model="moveSelect">
                <el-option key=1 label="程序更新" value=1></el-option>
                <el-option key=0 label="其他" value=0></el-option>
              </el-select>
              <el-button @click="handleMoveTopic">移动</el-button>
              <el-button @click="handleSetting">设置</el-button>
            </span>
          </span>
          <span class="table-limitScore">限制分</span>
          <span class="table-type">类型</span>
          <span class="table-createTime">创建时间</span>
        </div>
        <div v-if="DiffTopics.length!=0">
          <noticeItem
            v-for="item in DiffTopics"
            :key="item.id"
            :item="item"
            @flashPage="initData"
            @onSettingCheck="handleSettingCheck"
            :parentCheckState="checkState&&activeName=='DiffTopics'"
          ></noticeItem>
        </div>
        <noItem v-else v-loading="loadingState"></noItem>
      </el-tab-pane>
      <el-tab-pane label="其他" name="Others">
        <div v-if="Others.length!=0">
          <div class="table-header">
            <div class="check" @click.stop="handleCheck">
              <!-- {{topicItem.KeyFileIds.substring(0,1) }} -->
              <svg-icon icon-class="checked" v-if="checkState"></svg-icon>
              <svg-icon icon-class="unchecked" v-else></svg-icon>
            </div>
            <span class="table-title">
              <span v-if="checkBox.length==0">标题</span>
              <span v-else>
                <el-select v-model="moveSelect">
                  <el-option key="1" label="程序更新" value=1></el-option>
                  <el-option key="2" label="疑问解答" value=2></el-option>
                </el-select>
                <el-button @click="handleMoveTopic">移动</el-button>
                <el-button @click="handleSetting">设置</el-button>
              </span>
            </span>
            <span class="table-limitScore">限制分</span>
            <span class="table-type">类型</span>
            <span class="table-createTime">创建时间</span>
          </div>
          <noticeItem
            v-for="item in Others"
            :key="item.id"
            :item="item"
            @flashPage="initData"
            @onSettingCheck="handleSettingCheck"
            :parentCheckState="checkState&&activeName=='Others'"
          ></noticeItem>
        </div>
        <noItem v-else v-loading="loadingState"></noItem>
      </el-tab-pane>
      <!-- <el-tab-pane label="定时任务补偿" name="fourth">定时任务补偿</el-tab-pane> -->
    </el-tabs>
  </div>
</template>
<script>
import { movetopic, modifyscore, topicList } from "@/api/publictopic";
import noticeItem from "@/components/TopicItem/noticeItem.vue";
import noItem from "@/components/NoItem";
export default {
  name: "mynotice",
  components: {
    noticeItem,
    noItem
  },
  data() {
    return {
      activeName: "UpdateTopics", //当前显示
      UpdateTopics: [], //程序更新
      DiffTopics: [], //疑问解答
      Others: [], //其他
      checkBox: [], //当前选中的框
      checkState: false, //选择
      moveSelect: "", //移动到哪一栏
      loadingState:false
    };
  },
  mounted() {
    this.initData();
  },
  watch: {
    activeName() {
      this.checkState = false;
      this.checkBox.splice(0);
    }
  },
  methods: {
    /**移动帖子 */
    handleMoveTopic() {
      let obj = {
        TopicIds: this.checkBox.map(el => {
          return el.id;
        }),
        TopicValue: this.moveSelect
      };
      movetopic(obj).then(res => {
        if (res.Success) {
          this.$message.success("修改成功");
          this.initData();
        } else {
          this.$message.warning(res.ErrMes);
        }
      });
    },
    /**修改帖子限制分 */
    handleSetting() {
      this.$prompt("请输入新限制分", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        inputPattern: /[0-9]+/,
        inputErrorMessage: "格式不正确"
      })
        .then(({ value }) => {
          //   this.$message({
          //     type: "success",
          //     message: "你的邮箱是: " + value
          //   });
          let obj = {
            TopicIds: this.checkBox.map(el => {
              return el.id;
            }),
            TopicValue: value
          };
          modifyscore(obj).then(res => {
            if (res.Success) {
              this.$message.success("修改成功");
              this.DiffTopics.splice(0)
              this.UpdateTopics.splice(0)
              this.Others.splice(0)
              this.initData()
            } else {
              this.$message.warning(res.ErrMes);
            }
          });
        })
        .catch(() => {
        });
    },
    /**页面初始化数据 */
    initData() {
      this.loadingState = true
      topicList().then(res => {
      this.loadingState = false
        if (res.Success) {
          this.UpdateTopics = res.Data.Rows.UpdateTopics;
          this.DiffTopics = res.Data.Rows.DiffTopics;
          this.Others = res.Data.Rows.Others;
        } else {
          this.$message.warning(res.ErrMes);
        }
      });
    },
    /* */
    handleClick() {},
    handleCheck() {
      this.checkBox.splice(0);
      this.checkState = !this.checkState;
    },
    /**选择框 */
    handleSettingCheck(row, state) {
      if (state) {
        this.checkBox.push(row);
      } else {
        this.checkBox = this.checkBox.filter(el => {
          return el.id != row.id;
        });
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.my-notice {
  background: #fff;
  padding: 20px;
}
.el-tabs__content {
  background: #ddd !important;
}
.table-header {
  padding: 15px;
//   border: 1px solid red;
  background:#f8f8f8;
  height: 73px;
}

.check {
  display: inline-block;
  height: 40px;
  width: 40px;
  font-size: 20px;
  text-align: center;
  line-height: 40px;
  color: #fff;
  border-radius: 5px;
  box-sizing: border-box;
  opacity: 0.6;
  position: relative;
  top: 1px;
}
.table-title {
  display: inline-block;
  width: 560px;
  font-size: 18px;
  font-weight: 600;
}
.table-limitScore {
  display: inline-block;
  width: 70px;
  font-size: 18px;
  font-weight: 600;
}
.table-type {
  display: inline-block;
  width: 177px;
  font-size: 18px;
  font-weight: 600;
}
.table-createTime {
  display: inline-block;
  width: 100px;
  font-size: 18px;
  font-weight: 600;
}
</style>