<template>
  <div class="mytask-container">
    <!-- mytask 我的话题 -->
    <el-select
      v-model="CurrentSortCondition"
      @change="handleSort"
      class="sortCondition"
      v-if="CurrentTab!='draft'"
    >
      <el-option
        v-for="item in sortCondition"
        :key="item.value"
        :value="item.value"
        :label="item.name"
      ></el-option>
    </el-select>
    <el-select
      v-model="queryList.tagId"
      @change="handleSelectTagId"
      class="tagSelect"
      v-if="CurrentTab=='NeedSolved'||CurrentTab=='OldTopic'||CurrentTab=='NewTopic'||CurrentTab=='Unposted'"
    >
      <el-option v-for="item in dynamicTags" :key="item.Id" :value="item.Id" :label="item.name"></el-option>
    </el-select>
    <el-tabs type="border-card" v-model="CurrentTab" @tab-click="resettagId(CurrentTab)">
      <el-tab-pane label="新话题" name="NewTopic" :disabled="tagDisabled">
        <div v-loading="loadingState">
          <router-link
            :class="{'board-item-box':true,'border-striped':index%2==0}"
            :to="'/TopicSingle?topicId='+item.Id"
            v-for="(item,index) in newTopicList"
            :key="item.Id"
          >
            <span @click="handleDeleteTopic(index)">
              <complexItem
                :item="item"
                v-if="CurrentTab=='NewTopic'"
                :flashTopic="getList"
                :background="index"
                :key="item.Id"
              ></complexItem>
            </span>
          </router-link>
          <noItem v-if="newTopicList.length==0"></noItem>
        </div>
      </el-tab-pane>
      <el-tab-pane label="待解决" name="NeedSolved" :disabled="tagDisabled">
        <div v-loading="loadingState">
          <router-link
            :class="{'board-item-box':true,'border-striped':index%2==0}"
            :to="'/TopicSingle?topicId='+item.Id"
            v-for="(item,index) in newTopicList"
            :key="item.id"
          >
            <complexItem
              :item="item"
              v-if="CurrentTab=='NeedSolved'"
              :flashTopic="getList"
              :background="index"
              :key="item.Id"
            ></complexItem>
          </router-link>
          <noItem v-if="newTopicList.length==0"></noItem>
        </div>
      </el-tab-pane>
      <el-tab-pane label="旧话题" name="OldTopic" :disabled="tagDisabled">
        <div v-loading="loadingState">
          <router-link
            :class="{'board-item-box':true,'border-striped':index%2==0}"
            :to="'/TopicSingle?topicId='+item.Id"
            v-for="(item,index) in newTopicList"
            :key="item.Id"
          >
            <complexItem
              :item="item"
              :flashTopic="getList"
              v-if="CurrentTab=='OldTopic'"
              :background="index"
              :key="item.Id"
            ></complexItem>
          </router-link>
          <noItem v-if="newTopicList.length==0"></noItem>
        </div>
      </el-tab-pane>
      <el-tab-pane label="未结贴" name="Unposted" :disabled="tagDisabled">
        <div v-loading="loadingState">
          <router-link
            :class="{'board-item-box':true,'border-striped':index%2==0}"
            :to="'/TopicSingle?topicId='+item.Id"
            v-for="(item,index) in newTopicList"
            :key="item.id"
          >
            <complexItem
              :item="item"
              v-if="CurrentTab=='Unposted'"
              :flashTopic="getList"
              :background="index"
              :key="item.Id"
            ></complexItem>
          </router-link>
          <noItem v-if="newTopicList.length==0"></noItem>
        </div>
      </el-tab-pane>
      <el-tab-pane label="草稿帖" name="draft" :disabled="tagDisabled">
        <div v-loading="loadingState">
          <router-link
            :class="{'board-item-box':true,'border-striped':index%2==0}"
            :to="'/TopicSingle?topicId='+item.Id"
            v-for="(item,index) in newTopicList"
            :key="item.Id"
          >
            <complexItem
              :item="item"
              :flashTopic="getDraftTopic"
              v-if="CurrentTab=='draft'"
              :background="index"
              :key="item.Id"
            ></complexItem>
          </router-link>
          <!-- <complexItem :item="item" :flashTopic="getList" v-if="CurrentTab=='draft'"></complexItem> -->
          <noItem v-if="newTopicList.length==0"></noItem>
        </div>
      </el-tab-pane>
    </el-tabs>
    <!-- <el-pagination
      v-if="CurrentTab!='draft'"
      class="page"
      layout="total,sizes,prev, pager, next"
      :current-page="queryList.pageIndex"
      :page-size="queryList.pageSize"
      @size-change="handleSizeChange"
      @current-change="handlePageChange"
      :page-sizes="[10, 20, 30, 50]"
      :total="total"
    ></el-pagination>-->
    <Pagination
      :total="total"
      :listQuery="queryList"
      @PageChange="onPutPage"
      v-if="CurrentTab!='draft'"
      class="page"
    ></Pagination>
  </div>
</template>
<script>
import { GetNewTopic, draftTopic } from "@/api/topic.js";
import { formatTime, delHtmlTag } from "@/utils/index";
import complexItem from "@/components/TopicItem/complexItem";
import noItem from "@/components/NoItem";
import Cookies from "js-cookie"; //获取当前帖子停留状态
import Pagination from "@/components/Pagination";
import { getTag } from "@/api/addtag.js";
export default {
  components: {
    complexItem: complexItem,
    noItem,
    Pagination
  },
  name: "mytask",
  data() {
    return {
      //查询条件
      queryList: {
        pageIndex: 1, //当前页数
        pageSize: 10, //一页显示的条数
        state: 3,
        trackId: this.$store.state.user.userinfo.id, //搜索ID
        tagId: -1, //当前选择标签
        isDesc: false,
        sortWhere: "topic"
      },
      CurrentTab: "", //当前tab位置
      newTopicList: [], //新话题的列表
      total: 100, //总条数
      loadingState: false,
      dynamicTags: [
        { Id: -1, name: "全部" },
        { Id: 0, name: "无标签" }
      ], //所有标签
      tagDisabled: false,
      sortCondition: [
        //排序条件
        { name: "帖子状态降序", value: 0 },
        { name: "帖子状态升序", value: 1 },
        { name: "创帖时间降序", value: 2 },
        { name: "创帖时间升序", value: 3 },
        { name: "回帖时间降序", value: 4 },
        { name: "回帖时间升序", value: 5 }
      ],
      sortConditions: [
        { sortWhere: "state", isDesc: true },
        { sortWhere: "state", isDesc: false },
        { sortWhere: "topic", isDesc: true },
        { sortWhere: "topic", isDesc: false },
        { sortWhere: "reply", isDesc: true },
        { sortWhere: "reply", isDesc: false }
        
      ],
      CurrentSortCondition: 0 //当前选中的条件
    };
  },
  methods: {
    /**初始化数据 */
    initData() {
      // console.log(localStorage.getItem("totalPage")||50)
      if (Cookies.get("currentState") == undefined) {
        this.CurrentTab = "NewTopic";
        Cookies.set('currentState','NewTopic')
      } else {
        this.CurrentTab = Cookies.get("currentState");
      }
      if (this.CurrentTab == "NewTopic") {
        this.queryList.tagId = -1;
        this.queryList.state = 1;
      } else if (this.CurrentTab == "NeedSolved") {
        this.queryList.tagId = -1;
        this.queryList.state = 2;
      } else if (this.CurrentTab == "OldTopic") {
        this.queryList.tagId = -1;
        this.queryList.state = 3;
      } else if (this.CurrentTab == "draft") {
        this.queryList.tagId = -1;
        this.queryList.state = 4;
      } else if (this.CurrentTab == "Unposted") {
        this.queryList.tagId = -1;
        this.queryList.state = 0;
      }
      // console.log(localStorage.getItem("totalPage"))
      /**获取缓存中的排序列表 */

      // this.queryList.CurrentSortCondition = Number(Cookies.get('CurrentSortCondition')||0)
      this.CurrentSortCondition = Number(
        Cookies.get("CurrentSortConditions") || 0
      );

      /**获取当前页数 */
      this.queryList.pageIndex = Number(this.$route.query.pageIndex) || 1;
      let newList = {
        ...this.queryList,
        ...{
          pageIndex: Number(this.$route.query.pageIndex) || 1,
          pageSize: Number(localStorage.getItem("totalPage")||50),
          ...this.sortConditions[this.CurrentSortCondition]
        }
      };
      this.queryList = {...newList}
      this.queryList.pageSize = Number(localStorage.getItem("totalPage"))||50;
      if (this.CurrentTab == "draft") {
        this.getDraftTopic();
      } else {
        this.getList(newList);
        this.onGetTag();
      }
      // console.log(newList)
    },

    /**根据条件搜索 */
    handleSort(val) {
      // console.log(val)
      // this.CurrentSortCondition = val
      Cookies.set("CurrentSortConditions", val);
      this.queryList = { ...this.queryList, ...this.sortConditions[val] };
      this.getList(this.queryList);
    },
    /**修改分页 */
    onPutPage(listQuery) {
      // console.log(listQuery)
      this.queryList = listQuery;
      // console.log(this.queryList)
      this.getList(listQuery);
    },
    handleDeleteTopic(index) {
      this.newTopicList.splice(index, 1);
    },
    /**获取便签 */
    onGetTag() {
      getTag().then(res => {
        if (res.Success) {
          this.dynamicTags = this.dynamicTags.concat(res.Data.Rows);
        } else {
          this.$message.warning(res.ErrMes);
        }
      });
    },
    /**点击tab */
    resettagId(newValue) {
      let state = null;
      // this.$store.commit('currentState',newValue)
      Cookies.set("currentState", newValue);
      if (newValue == "NewTopic") {
        this.queryList.tagId = -1;
        state = 1;
      } else if (newValue == "NeedSolved") {
        this.queryList.tagId = -1;
        state = 2;
      } else if (newValue == "OldTopic") {
        this.queryList.tagId = -1;
        state = 3;
      } else if (newValue == "draft") {
        this.queryList.tagId = -1;
        state = 4;
      } else if (newValue == "Unposted") {
        this.queryList.tagId = -1;
        state = 0;
      } else {
        state = null;
      }
      this.newTopicList = [];
      if (state < 4) {
        this.ResetQueryList(state)
          .then(res => {
            console.log(this.queryList)
            this.getList(this.queryList);
          })
          .catch(err => {
            if (this.queryList.state == null) {
              this.$message({
                message: "状态错误",
                type: "warning"
              });
              return false;
            }
          });
      } else if (state == 4) {
        this.getDraftTopic();
      }
    },
    //获取列表
    getList(queryList) {
      this.tagDisabled = true;
      this.loadingState = true;
      this.queryList.tagId = Number(Cookies.get("tagId") || -1);
      GetNewTopic(queryList).then(res => {
        this.loadingState = false;
        this.tagDisabled = false;
        if (res.Success) {
          this.newTopicList = res.Data.Rows;
          this.total = res.Data.Total;
        }
      });
    },
    /**获取草稿贴 */
    getDraftTopic() {
      this.loadingState = true;
      draftTopic(this.queryList).then(res => {
        this.loadingState = false;
        if (res.Success) {
          this.newTopicList = res.Data.Rows;
          this.total = res.Data.Total;
        }
      });
    },
    ResetQueryList(state) {
      this.queryList.pageIndex = 1;
      this.$router.push({
        query: { pageIndex: 1 }
      });
      this.queryList.state = state;
      this.newTopicList.splice(0, this.newTopicList.length - 1);
      return new Promise((resolve, reject) => {
        if (state != null) {
          resolve();
        } else {
          reject();
        }
      });
    },
    /**修改标签 */
    handleSelectTagId(val) {
      Cookies.set("tagId", val);
      this.queryList.tagId = val;
      this.getList(this.queryList);
    }
  },
  created() {
    // console.log(this.queryList);
    // this.getList();
    this.initData();
  },
  watch: {
    // CurrentTab(newValue, oldValue) {
    //   let state = null;
    //   // this.$store.commit('currentState',newValue)
    //   Cookies.set("currentState", newValue);
    //   if (newValue == "NewTopic") {
    //     this.queryList.tagId = -1;
    //     state = 1;
    //   } else if (newValue == "NeedSolved") {
    //     this.queryList.tagId = -1;
    //     state = 2;
    //   } else if (newValue == "OldTopic") {
    //     this.queryList.tagId = -1;
    //     state = 3;
    //   } else if (newValue == "draft") {
    //     this.queryList.tagId = -1;
    //     state = 4;
    //   } else if (newValue == "Unposted") {
    //     this.queryList.tagId = -1;
    //     state = 0;
    //   } else {
    //     state = null;
    //   }
    //   this.newTopicList = [];
    //   if (state < 4) {
    //     this.ResetQueryList(state)
    //       .then(res => {
    //         this.getList(this.queryList);
    //       })
    //       .catch(err => {
    //         if (this.queryList.state == null) {
    //           this.$message({
    //             message: "状态错误",
    //             type: "warning"
    //           });
    //           return false;
    //         }
    //       });
    //   } else if (state == 4) {
    //     this.getDraftTopic();
    //   }
    // }
  }
};
</script>


<style rel="stylesheet/scss" lang="scss" scoped>
.mytask {
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
.mytask-container {
  position: relative;
}
.board-item-box {
  // border:1px solid red;
  display: block;
  width: 100%;
  height: 60px;
  border-radius: 10px;
  padding: 5px;
  box-sizing: border-box;
}
.border-striped {
  background: #ededed;
}
.board-item-box:hover {
  background: #e5effa;
}
.board-item {
  display: flex;
  height: 100%;
  justify-content: space-between;
  align-items: center;
}
.tagSelect {
  position: absolute;
  top: 0px;
  right: 0px;
  z-index: 2;
}
.sortCondition {
  position: absolute;
  top: 0px;
  right: 210px;
  z-index: 2;
}
</style>
