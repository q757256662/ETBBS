<template>
  <!-- TopicList 话题查询 -->
  <div>
    <el-form :inline="true" class="search_form" label-position="top">
      <el-form-item label>
        <el-tooltip class="item" effect="light" content="类型" placement="top">
          <el-select v-model="SubmitQuery.topicType" @change="chageTopicType" placeholder="类型">
            <el-option-group label="类型">
              <el-option label="（全选）" :value="''"></el-option>
              <el-option
                :label="item.KeyName"
                :value="item.KeyName"
                v-for="item in ConditionQuery.TopicType"
                :key="item.KeyId"
              ></el-option>
            </el-option-group>
          </el-select>
        </el-tooltip>
      </el-form-item>
      <el-form-item label>
        <el-tooltip class="item" effect="light" content="发帖人属于的公司" placement="top">
          <el-select
            v-model="SubmitQuery.companyId"
            @change="chageCompany"
            placeholder="发帖人属于的公司"
            filterable
          >
            <el-option-group label="发帖人属于的公司">
              <el-option label="（全选）" :value="0"></el-option>
              <el-option
                :label="item.CompanyName"
                :value="item.CompanyId"
                v-for="item in ConditionQuery.BelongCompany"
                :key="item.CompanyId"
              ></el-option>
            </el-option-group>
          </el-select>
        </el-tooltip>
      </el-form-item>
      <el-form-item label>
        <el-tooltip class="item" effect="light" content="回复人" placement="top">
          <el-select
            v-model="SubmitQuery.replyUserId"
            @change="chageReplyUser"
            placeholder="回复人"
            filterable
          >
            <el-option-group label="回复人">
              <el-option label="（全选）" :value="0"></el-option>
              <el-option
                :label="item.UserName"
                :value="item.UserId"
                v-for="item in ConditionQuery.ReplyUsers"
                :key="item.UserId"
              ></el-option>
            </el-option-group>
          </el-select>
        </el-tooltip>
      </el-form-item>
      <el-form-item label>
        <el-tooltip class="item" effect="light" content="帖子状态" placement="top">
          <el-select v-model="SubmitQuery.topicState" placeholder="帖子状态" @change="chageState">
            <el-option-group label="帖子状态">
              <!-- <el-option label="（全选）" :value="0"></el-option> -->
              <el-option
                :label="item.label"
                :value="item.value"
                v-for="item in ConditionQuery.topicState"
                :key="item.value"
              ></el-option>
            </el-option-group>
          </el-select>
        </el-tooltip>
      </el-form-item>

      <el-form-item>
        <el-input
          v-model="SubmitQuery.topicDetail"
          placeholder="帖子描述"
          @keyup.enter.native="handleClickSearch"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-tooltip class="item" effect="light" content="全文搜索" placement="top">
          <el-checkbox v-model="SubmitQuery.isAllContent"></el-checkbox>
        </el-tooltip>
      </el-form-item>
      <div class="from-btn">
        <el-button size="mini" type="primary" @click="handleClickSearch">搜索</el-button>
        <el-button
          v-if="showNoBtn == true"
          :class="{'active':showDefault==true}"
          size="mini"
          type="info"
          @click="handleNododyTopic"
        >没有人管的帖子</el-button>
      </div>
    </el-form>
    <div style="background:#fff;">
      <a
        :class="{'board-item-box':true,'border-striped':index%2==0}"
        v-for="(item,index) in newTopicList"
        :key="item.id"
        @click="routerLink(item)"
      >
        <div class="board-item">
          <span class="line" :style="{borderLeft: `4px solid ${item.Color}`}"></span>
          <div class="title-recent">
            <div class="avatar" :style="{background:item.Color}">
              <!-- <img src="http://szcert.ebs.org.cn/Images/govIcon.gif" alt=""> -->
              {{item.keyFileIds.substring(0,1) }}
            </div>
            <div class="right">
              <h2>
                <p class="title" :title="item.title">{{item.title}}</p>
              </h2>
            </div>
          </div>

          <span
            class="collect-icon"
            v-if="createUId == item.createUId  && SubmitQuery.topicState == 2"
            title="转为未结帖"
            @click.prevent="handleResTopic({item})"
          >
            <i class="el-icon-refresh"></i>
          </span>
          <span
            @click.prevent="handleResultTopicToNotice({item})"
            v-if="SubmitQuery.topicState == 2 && roleState == '管理员'"
            title="转为公告贴"
            class="collect-icon"
          >
            <i class="el-icon-star-off"></i>
            <!-- <svg-icon  icon-class="collection"></svg-icon> -->
          </span>
          <span style="margin-right: 10px;" title="加急" v-if="item.IsHot">
            <svg-icon icon-class="hot"></svg-icon>
          </span>
          <span
            class="mark"
            title="钉一下"
            @click.prevent.stop="handleMark({title:item.title,topicId:item.id})"
          >
            <svg-icon icon-class="mark"></svg-icon>
          </span>

          <div class="left">
            <div class="topic-info lefttext" v-if="showDefault == false">
              <span class="time">时间：{{item.UpdateTime}}</span>
            </div>
            <div class="topic-info lefttext" v-if="showDefault == true">
              <span class="time">发帖人：{{item.name}}</span>
            </div>

            <div class="lefttext">
              <span :title="item.keyFileIds" class="keyFiles">
                类型：
                <i class="block" :style="{background:item.Color}"></i>
                {{item.keyFileIds}}
              </span>
            </div>
          </div>
          <span class="icons">
            <!-- icon专用 TODO -->
          </span>
          <div class="append-icons">
            <!-- icon专用 TODO -->
          </div>
        </div>
      </a>
      <noItem v-if="newTopicList.length==0" v-loading="loadingState"></noItem>
    </div>
    <!-- <NobodyTop :total="total"  v-if="showDefault == true"  :TopicList="newTopicList" @handleNododyChange="handleNododyTopic"> </NobodyTop> -->
    <!-- <el-pagination
      class="page"
      layout="total,sizes,prev, pager, next"
      :current-page="queryList.pageIndex"
      @size-change="handleSizeChange"
      @current-change="handlePageChange"
      :page-sizes="[10, 20, 30, 50]"
      :total="total"
    ></el-pagination>-->
    <el-dialog title="转为未结帖" :visible.sync="dialogVisible" class="changeDialog">
      <EditSimple :currentTopic="topicId" @onGetList="handleClose"></EditSimple>
      <!-- <span slot="footer" class="dialog-footer">
    <el-button @click="dialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
      </span>-->
    </el-dialog>
    <Pagination
      :total="total"
      :listQuery="queryList"
      :typeState="showNoBtn"
      v-if="showDefault ==false"
      @PageChange="handleClickSearch"
      class="page"
    ></Pagination>
    <Pagination
      :total="total"
      :listQuery="queryList"
      :typeState="showNoBtn"
      v-if="showNoBtn == true && showDefault == true"
      @PageChange="handleNododyTopic"
      class="page"
    ></Pagination>
  </div>
</template>

<script>
import {
  LoadQueryCondition, //加载查询条件
  GetTopicList, //搜索贴子
  changeTopic, //转为为结帖
  getNobodyList //加载没人管的帖子
} from "@/api/topicList.js";
import { MarkTopic } from "@/api/topic";
import { GetContents, collect, trunnotice } from "@/api/Contents";
import { formatTime, delHtmlTag } from "@/utils/index";
import { getTag } from "@/api/addtag.js";
import noItem from "@/components/NoItem";
import NobodyTop from "./NobodyTop";
import Pagination from "@/components/Pagination";
import { mapState } from "vuex";
import EditSimple from "./EditSimple";
export default {
  components: {
    noItem,
    Pagination,
    EditSimple,
    NobodyTop
  },
  data() {
    return {
      newTopicList: [], //新话题的列表
      total: 1000, //总条数
      colorBox: {
        ULSG打推: "#FB966E",
        ET打推: "rgb(64, 158, 255)",
        Bag打推: "#FF9999",
        排料: "#99CC33",
        绘图仪和切割机: "#FF9900",
        网络睿排: "rgb(239, 191, 0)",
        版本发布: "#FF0033",
        ETPS: "#FF9966",
        ETBRA: "#FF8000",
        裁床: "#FF9966",
        功能操作说明: "#FF9966",
        没有: "#ccc",
        排料: "#99CC33",
        升级内容: "#00AEAE",
        数字化仪: "#0066CC",
        培训文档: "#8C8C00",
        ICM: "#8080C0",
        PPT: "#804040",
        微信: "#8F4586",
        ET: "#00EC00"
      },
      queryList: {
        pageIndex: 1, //当前页数
        pageSize: 10 //一页显示的条数
      },
      SubmitQuery: {
        topicType: "", //帖子关键词
        companyId: 0, //查询公司ID
        replyUserId: 0, //查找回帖人的ID
        topicState: -1, //帖子状态[0未结贴 2 结贴 3 草稿贴]
        topicDetail: "", //帖子描述
        isAllContent: false //是否全文搜索
      },
      ConditionQuery: {
        topicState: [
          { label: "（全选）", value: -1 },
          { label: "已结贴", value: 2 },
          { label: "未结帖", value: 0 },
          { label: "久贴未解决", value: 3 }
        ]
      }, //查询条件列表
      loadingState: false,
      roleState: "",
      createUId: "",
      dialogVisible: false,
      topicId: "",
      showNoBtn: false,
      showDefault: false
    };
  },
  watch: {},
  async created() {
    this.SubmitQuery.topicDetail = this.$route.params.topicDetail || "";
    this.showNoBtn =
      this.$store.state.user.userinfo.CompanyName ==
      "（开发）深圳市布易科技有限公司";
    // console.log(this.showNoBtn);
    await this.LoadCondition();
    // this.getTagList();
    // console.log(this.$store.state.user);
    this.roleState = this.$store.state.user.userinfo.Role;
    this.createUId = this.$store.state.user.userinfo.id;
    this.queryList.pageIndex = Number(this.$route.query.pageIndex) || 1;
    this.queryList.pageSize = Number(localStorage.getItem("totalPage")) || 50;
    // console.log(this.$route.query)
    this.SubmitQuery.companyId = Number(this.$route.query.companyId) || 0;
    this.SubmitQuery.replyUserId = Number(this.$route.query.replyUserId) || 0;
    this.SubmitQuery.topicDetail = this.$route.query.topicDetail || "";
    this.SubmitQuery.topicState = Number(this.$route.query.topicState || -1);
    this.SubmitQuery.topicType = this.$route.query.topicType || "";
    this.SubmitQuery.isAllContent = Boolean(this.$route.query.isAllContent)
    this.handleClickSearch();
  },
  methods: {
    handleMark(item) {
      MarkTopic(item).then(res => {
        if (res.Success) {
          this.$message({
            message: "标记成功",
            type: "success"
          });
        } else {
          this.$message({
            message: res.ErrMes,
            type: "warning"
          });
        }
      });
    },
    /**结贴转化为未结贴 */
    handleResTopic(row) {
      // console.log(row);
      this.topicId = row.item.id;
      this.$confirm("将此贴转化为未结贴, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.dialogVisible = true;
        })
        .catch(() => {});
    },
    //转为为结帖
    handleClose(e) {
      // console.log(e);
      this.dialogVisible = false;
      this.handleClickSearch();
    },
    /**结贴转为公告贴 */
    handleResultTopicToNotice(row) {
      // console.log(row);
      this.$confirm("将此贴转化为公告贴, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          trunnotice({ TopicId: row.item.id })
            .then(res => {
              if (res.Success) {
                this.$message.success("成功");
                this.handleClickSearch();
                // this.$router.push({ path: "mytask" });
              } else {
                this.$message.warning(res.ErrMes);
              }
            })
            .catch(err => {
              console.log(err);
            });
        })
        .catch(() => {});
    },
    /**(收藏) */
    // handleCollect(item) {
    //   let obj = {};

    //   obj.ReplyId = item.item.id;
    //   obj.LimitScore = 0;
    //     // console.log(obj);
    //   collect(obj).then(res => {
    //     if (res.Success) {
    //       this.$message.success("收藏成功");
    //     } else {
    //       this.$message.warning(res.ErrMes);
    //     }
    //   });
    // },

    /*状态 */
    chageState(e) {
      this.queryList.pageIndex = 1;
      this.handleClickSearch();
    },
    /*//帖子类型 */
    chageTopicType(e) {
      this.queryList.pageIndex = 1;
      this.handleClickSearch();
    },
    /*//回复人 */
    chageReplyUser(e) {
      this.queryList.pageIndex = 1;
      this.handleClickSearch();
    },
    /*/选择的公司*/
    chageCompany(e) {
      this.queryList.pageIndex = 1;
      this.handleClickSearch();
    },
    //加载搜索条件
    LoadCondition() {
      return new Promise((resolve, reject) => {
        LoadQueryCondition().then(res => {
          if (res.Success) {
            this.ConditionQuery = { ...res.Data, ...this.ConditionQuery };
            resolve();
          } else {
            this.$message({
              message: res.ErrMes,
              type: "error"
            });
            reject(res.ErrMes);
          }
        });
      });
    },
    //加载没人管的帖子
    handleNododyTopic() {
      // console.log('22222222222');
      this.showDefault = true;
      this.loadingState = true;
      // console.log(this.$store.state.user.userinfo);
      // console.log( this.$store.state.user.userinfo.CompanyName !==
      // "（开发）深圳市布易科技有限公司");
      getNobodyList(this.queryList).then(res => {
        this.loadingState = false;
        if (res.Success) {
          this.newTopicList =
            res.Data &&
            res.Data.Rows.map(el => {
              // console.log(el)
              el.UpdateTime = formatTime(el.EndTopicTime, false);
              // console.log(el.keyFileIds)
              if (el.keyFileIds.indexOf(",") != -1) {
                el.keyFileIds = el.keyFileIds.substring(
                  0,
                  el.keyFileIds.length - 1
                );
                let colorBox = el.keyFileIds.split(",");
                el.Color = this.colorBox[colorBox[0]];
                el.Color == undefined ? (el.Color = "red") : el.Color;
              } else {
                let colorBox = el.keyFileIds;
                el.Color = this.colorBox[colorBox];
                el.Color == undefined ? (el.Color = "red") : el.Color;
              }
              return el;
            });
          this.total = res.Data.Total;
        } else {
          this.$message({
            message: res.ErrMes,
            type: "error"
          });
        }
      });
    },
    //搜索帖子
    handleClickSearch() {
      this.loadingState = true;
      this.showDefault = false;
      this.$router.push({
        query: { ...this.SubmitQuery, ...this.queryList }
      });
      GetTopicList({ ...this.SubmitQuery, ...this.queryList }).then(res => {
        this.loadingState = false;
        if (res.Success) {
          this.newTopicList =
            res.Data &&
            res.Data.Rows.map(el => {
              //           GetContents({
              //   topicId: el.id
              // }).then(res=>{
              //     if(res.Data.Rows == []){
              //          console.log("id="+el.id);
              //           console.log("id="+el.title);
              //     }
              // })
              // console.log(el)
              el.UpdateTime = formatTime(el.createTime, false);
              // console.log(el.keyFileIds)
              if (el.keyFileIds.indexOf(",") != -1) {
                el.keyFileIds = el.keyFileIds.substring(
                  0,
                  el.keyFileIds.length - 1
                );
                let colorBox = el.keyFileIds.split(",");
                el.Color = this.colorBox[colorBox[0]];
                el.Color == undefined ? (el.Color = "red") : el.Color;
              } else {
                let colorBox = el.keyFileIds;
                el.Color = this.colorBox[colorBox];
                el.Color == undefined ? (el.Color = "red") : el.Color;
              }
              return el;
            });
          this.total = res.Data.Total || 0;
        } else {
          this.$message({
            message: res.ErrMes,
            type: "error"
          });
        }
      });
    },
    // 路由跳转函数
    routerLink(obj) {
      // console.log('点击了');
      // console.log(obj);
      var routeData = this.$router.push({
        path: "/TopicSingle",
        query: {
          topicId: obj.id
        }
      });
      // let arr = routeData.href.split("?")

      // let href = arr[0].substring(0,arr[0].length-1)+'?'+arr[1]
      // console.log(href)
      // console.log(href+'?'+arr[1])
      // window.open(href, "_blank");
      // this.$router.push({
      //   // path: '/TopicSingle',
      //   name: 'TopicSingle',
      //   // params: {
      //   //     name: 'name',
      //   //     dataObj: this.msg
      //   // }
      //   query: {
      //     topicId: obj.id,
      //     title:obj.title,
      //     topicState:obj.state
      //   }
      // });
      // localStorage.setItem('OrderInfo', JSON.stringify(obj))
    }
  }
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.line {
  text-align: center;
}
.mytask {
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
.board-item-box {
  display: block;
  width: 100%;
  height: 58px;
  box-sizing: border-box;
  margin: 5px 0;
  background: #fff;
  border-radius: 5px;
}
.board-item:hover {
  background: #e5effa;
}
.board-item {
  display: flex;
  height: 100%;
  justify-content: space-between;
  align-items: center;
  border-radius: 5px;
  padding: 5px 10px;
  box-sizing: border-box;
}
.title {
  font-size: 14px;
  margin: 10px 0;
  white-space: nowrap;
  /* 不换行 */
  overflow: hidden;
  text-overflow: ellipsis;
  width: 100%;
  width: 557px;
}
.title-recent {
  margin-left: 18px;
  display: flex;
  height: 100%;
  align-items: center;
  width: 700px;
}
.title-recent .avatar {
  display: block;
  height: 32px;
  min-width: 32px;
  font-size: 20px;
  text-align: center;
  line-height: 31px;
  color: #fff;
  border-radius: 5px;
  box-sizing: border-box;
  opacity: 0.6;
}
.title-recent .avatar img {
  // max-height:50px;
  // max-width:50px;
  height: 100%;
  width: 100%;
}
.title-recent .right {
  margin-left: 10px;
  width: 557px;
}
.title-recent .right h2 p {
  margin: 10px 0;
  font-size: 16px;
  font-weight: 600;
  height: 20px;
  line-height: 20px;
}
.topic-info {
  width: 125px;
}
.title-recent .right .topic-info {
  font-size: 15px;
  width: 700px;
}
.title-recent .right .topic-info .author {
  display: inline-block;
  color: #337ab7;
  width: 70px;
}
.title-recent .right .topic-info .time {
  margin-left: 10px;
  width: 130px;
}
.title-recent .right .keyFiles {
  font-size: 16px;
  margin-left: 10px;
  color: #343a40;
}
.left {
  display: flex;
  flex-direction: column;
  width: 200px;
  // margin-left: 80px;
  justify-content: space-between;

  .lefttext {
    flex: 1;
    overflow: hidden; /*超出部分隐藏*/
    text-overflow: ellipsis; /* 超出部分显示省略号 */
    white-space: nowrap; /*规定段落中的文本不进行换行 */
    width: 200px; /*需要配合宽度来使用*/
    font-size: 14px;
    margin-bottom: 3px;
    margin-top: 6px;
    line-height: 18px;
  }
}
.detail {
  display: flex;
  align-items: center;
  width: 50%;
  height: 100%;
  justify-content: space-between;
}
.detail .count-block {
  width: 100px;
  text-align: center;
}
.detail .count {
  margin-left: 20px;
  display: inline-block;
  text-align: center;
}
.detail .count .num {
  font-size: 20px;
  color: #aaa;
}
.detail .count .txt {
  font-size: 15px;
  color: #ccc;
  margin-top: 25px;
}
.line {
  // border-left: 4px solid #ccc;
  height: 100%;
  padding-left: 0;
  opacity: 0.6;
}
.detail .recent {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  min-width: 300px;
  height: 100%;
  box-sizing: border-box;
  margin-left: 50px;
}
.recent .post {
  height: 100%;
  width: 100%;
  box-sizing: border-box;
  margin: 0 20px;
  padding: 8px 0;
  font-size: 15px;
}
.recent .post .content {
  font-size: 0.8em;
  color: #aaa;
  margin: 10px 0;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box; //作为弹性伸缩盒子模型显示。
  -webkit-box-orient: vertical; //设置伸缩盒子的子元素排列方式--从上到下垂直排列
  -webkit-line-clamp: 2; //显示的行
  width: 450px;
}
.time {
  color: #888;
  width: 200px; // float: right;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.block {
  height: 10px;
  width: 10px;
  display: inline-block;
  opacity: 0.6;
}

.search_form {
  // border:1px solid red;
  border-bottom: 1px solid #ddd;
  background: #fff;
  padding: 20px;
  padding-bottom: 0px;
  height: 80px;
}

.NoMessage {
  height: 50px;
  line-height: 50px;
  text-align: center;
  border: 1px solid #e5effa;
  background: #fff;
  border-radius: 5px;
  color: #888;
  font-size: 15px;
  margin-top: 5px;
}

.search_form .el-form-item {
  // width: 140px;
  margin-right: 0px;
}

.search_form .el-input {
  width: 130px;
}

.search_form .el-select {
  width: 130px;
}
.border-striped {
  background: #ededed;
}
.mark {
  margin-right: 10px;
  line-height: 40px;
}
.collect-icon {
  margin-right: 10px;
  line-height: 40px;
}
.changeDialog /deep/ .el-dialog {
  min-width: 775px;
  width: 50%;
}
.changeDialog /deep/ .el-dialog__body {
  min-width: 775px;
  padding: 0px 20px !important;
  height: 500px;
}
.from-btn {
  margin-top: 4px;
  display: inline-flex;
  button {
    height: 32px;
  }
}
.active {
  background: red;
}
</style>



