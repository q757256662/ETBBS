<template>
  <!-- PublicTopic本公司公告 -->
  <div>
    <div style="background:#fff;" class="newTopicClass">
      <!-- <div class="fun-search">
        <el-input
          class="search"
          placeholder="请输入帖子标题或关键字"
          suffix-icon="el-icon-search"
          @keyup.enter.native="handleSearch"
          v-model="queryList.queryStr"
          auto-complete="off"
          size="small"
        ></el-input>
        <el-button size="mini" @click="handleSearch" type="primary">搜索</el-button>
      </div>-->
      <span @click="handleRemind(item,index)" v-for="(item,index) in newTopicList" :key="item.Id">
        <router-link
          :class="{'border-item':true,'border-striped':index%2==0}"
          :to="'/TopicSingle?topicId='+item.Id"
        >
          <TopicItem :item="item" :flashTopic="getList"></TopicItem>
        </router-link>
      </span>

      <noItem v-if="newTopicList.length==0" v-loading="loadingState"></noItem>
    </div>
    <!-- <el-pagination
        class="page"
        layout="total,sizes,prev, pager, next"
        :current-page="queryList.pageIndex"
        @size-change="handleSizeChange"
        @current-change="handlePageChange"
        :page-sizes="[10, 20, 30, 50]"
        :total="total"
    ></el-pagination>-->
    <Pagination
      :total="total"
      :listQuery="queryList"
      @PageChange="getList"
      class="page"
      hidden="true"
    ></Pagination>
  </div>
</template>

<script>
import TopicItem from "@/components/TopicItem";
import { getList } from "@/api/publictopic.js";
import { getNewpublic, cancleRemind } from "@/api/topic";

import noItem from "@/components/NoItem";
import Pagination from "@/components/Pagination";
export default {
  components: {
    TopicItem: TopicItem,
    noItem,
    Pagination
  },
  data() {
    return {
      newTopicList: [], //新话题的列表
      total: 0, //总条数
      CurrentTab: "updateProgram", //当前tab位置
      queryList: {
        pageIndex: 1, //当前页数
        pageSize: 10, //一页显示的条数
        queryStr: ""
      },
      loadingState: false,
    };
  },
  watch: {
    CurrentTab(newValue, oldValue) {
      let group = null;
      if (newValue == "updateProgram") {
        group = 1;
      } else if (newValue == "question") {
        group = 2;
      } else if ((newValue = "other")) {
        group = 0;
      } else {
        group = "";
      }
      this.ResetQueryList(group)
        .then(res => {
          this.getList();
        })
        .catch(err => {
          if (this.queryList.group == null) {
            this.$message({
              message: "状态错误",
              type: "error"
            });
            return false;
          }
        });
    }
  },
  created() {
    this.getList();
  },
  methods: {
    /**取消提醒 */
    handleRemind(item, index) {
      this.newTopicList.splice(index,1)
      cancleRemind({topicId:item.Id,topicType:0}).then(res=>{
        // console.log(res)
        if(res.Success){
          this.$store.commit('SET_DOT',this.total-1)
          this.total--
        }
      })
      // console.log(item);
      // console.log(index);
    },
    getList() {
      this.loadingState = true;
      getNewpublic().then(res => {
        this.loadingState = false;
        if (res.Success) {
          this.newTopicList = res.Data.Rows.map(el=>{
            el.EndTopicTime = el.CreateTime
            return el
          })
          this.total = res.Data.Total;
        }
      });
    },
    handleSearch() {
      // if (this.queryList.queryStr) {
      this.getList();
      // } else {
      //   this.$message({
      //     message: "请输入查询条件!",
      //     type: "warning"
      //   });
      // }
    },
    ResetQueryList(state) {
      this.queryList.pageIndex = 1;
      this.queryList.group = state;
      return new Promise((resolve, reject) => {
        if (state != null) {
          resolve();
        } else {
          reject();
        }
      });
    },
    handlePageChange(page) {
      this.queryList.pageIndex = page;
      this.getList();
    },
    handleSizeChange(val) {
      this.queryList.pageSize = val;
      this.queryList.pageIndex = 1;
      this.getList();
    }
  }
};
</script>
<style lang="scss" scoped>
.board-item-box {
  /* height:100px; */
  width: 100%;
}
.border-item {
  background: #fff;
  height: 50px;
  display: block;
  margin-bottom: 5px;
  border-radius: 5px;
  padding: 0 5px;
}
.border-item:hover {
  background: #e5effa;
}
.clear {
  clear: both;
}
.border-striped {
  background: #ededed;
}
.fun-search {
  margin-bottom: 15px; // width: 400px;
  /* float: right; */
  left: 500px;
  .el-input {
    width: 300px;
  }
  .search {
    margin-top: 15px;
    margin-left: 15px;
  }
}
.newTopicClass {
  padding:10px;
  background: #fff;
}
</style>