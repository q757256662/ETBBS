<template>
  <div class="mytask-container">
    <router-link class="board-item-box" :to="'/TopicSingle?topicId='+item.Id+'&topicState='+3" v-for="item in newTopicList" :key="item.Id">
         <complexItem :item="item" :flashTopic="getList"></complexItem>
    </router-link>
    <noItem v-if="newTopicList.length==0" v-loading="loadingState"></noItem>
    <el-pagination class="page" layout="total,sizes,prev, pager, next" :current-page="queryList.pageIndex" @size-change="handleSizeChange" @current-change="handlePageChange" :page-sizes="[10, 20, 30, 50]" :total="total">
    </el-pagination>
  </div>
</template>
<script>
  import {
    GetNewTopic
  } from '@/api/topic.js';
  import {
    formatTime,
    delHtmlTag
  } from '@/utils/index'
  import complexItem from "@/components/TopicItem/complexItem"
  import noItem from '@/components/NoItem'
  export default {
    components: {
      complexItem: complexItem,
      noItem
    },
    name: 'mytask',
    data() {
      return {
        //查询条件
        queryList: {
          pageIndex: 1, //当前页数
          pageSize: 10, //一页显示的条数
          state: 3,
          trackId: this.$store.state.user.userinfo.id //搜索ID
        },
        CurrentTab: 'NewTopic', //当前tab位置
        newTopicList: [], //新话题的列表
        total: 0, //总条数
        colorBox: {
          "ULSG打推": "#FB966E",
          "ET打推": "rgb(64, 158, 255)",
          "Bag打推": "#FF9999",
          "排料": "#99CC33",
          "绘图仪和切割机": "#FF9900",
          "网络睿排": "rgb(239, 191, 0)",
          "版本发布": "#FF0033",
          "ETPS": "#FF9966",
          "裁床": "#FF9966",
          "功能操作说明": "#FF9966"
        },
        loadingState:false
      }
    },
    methods: {
      handlePageChange(page) {
        this.queryList.pageIndex = page;
        this.getList();
      },
      handleSizeChange(val) {
        this.queryList.pageSize = val;
        this.queryList.pageIndex = 1;
        this.getList();
      },
      //获取列表
      getList() {
        this.loadingState = true
        GetNewTopic(this.queryList).then(res => {
        this.loadingState = false
          if (res.Success) {
            this.newTopicList = res.Data.Rows;
            this.total = res.Data.Total;
          }
        })
      },
      ResetQueryList(state) {
        this.queryList.pageIndex = 1;
        this.queryList.state = state;
        return new Promise((resolve, reject) => {
          if (state != null) {
            resolve()
          } else {
            reject()
          }
        })
      }
    },
    created() {
      this.getList();
    },
    mounted () {
      // this.$refs.tabs.$el.children[0].style="position:fixed"
      // console.log(this.$refs.tabs.$el.children[0])
    },
    watch: {
      CurrentTab(newValue, oldValue) {
        let state = null;
        if (newValue == 'NewTopic') {
          state = 1
        } else if (newValue == 'NeedSolved') {
          state = 2
        } else if(newValue = 'OldTopic'){
            state = 3
        }
        else {
          state = null
        }
        this.ResetQueryList(state).then(res => {
          this.getList();
        }).catch(err => {
          if (this.queryList.state == null) {
            this.$message({
              message: "状态错误",
              type: "error"
            })
            return false;
          }
        })
      }
    }
  }
</script>


<style rel="stylesheet/scss" lang="scss" scoped>
  .mytask {
    &-text {
      font-size: 30px;
      line-height: 46px;
    }
  }
  .board-item-box {
    // border:1px solid red;
    display: block;
    width: 100%;
    height: 100px;
    border-radius: 10px;
    padding: 5px;
    box-sizing: border-box;
    background:#fff;
    margin-bottom:10px;
    border-bottom:1px solid #ccc;
  }
  .board-item-box:hover {
    background: #e5effa;
  }
  .board-item {
    display: flex;
    height: 100%;
    justify-content: space-between;
    align-items: center;
        padding: 15px;
  }
</style>
