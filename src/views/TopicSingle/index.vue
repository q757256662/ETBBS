<template>
  <div class="QuestionPage" ref="QuestionPage">
    <!-- TopicSingle 帖子详情 -->
    <div class="Topic_container">
      <div class="QuestionHeader">
        <div class="list_header">
          <div>
            <p
              class="avator-color"
              :style="{background:onSelectColor(titleDetails.Name)}"
            >{{!!titleDetails.Name&&titleDetails.Name.substring(0,1)}}</p>
            <div class="user_detail">
              <div>{{titleDetails.Name}}</div>
            </div>
          </div>
          <div style="line-height:40px;margin-right:10px;">{{titleDetails.CompanyName}}</div>
        </div>
        <div class="QuestionHeader_main">
          <h2 class="title">
            <i
              title="修改标题"
              style="color:red;cursor:pointer"
              @click="showTopicTitle"
              class="el-icon-edit"
            ></i>
            <i
              title="查看状态"
              style="color:red;cursor:pointer"
              @click="handleViewState"
              class="el-icon-view"
            ></i>
            {{topicTitle}}
            <i
              style="cursor:pointer"
              @click="chageShow"
              title="查看所有回复"
              class="el-icon-caret-bottom"
            ></i>
          </h2>
          <!-- <span>{{titleDetails.Name}}:</span> -->
          <p
            v-html="titleDetails.Contents"
            style="margin:10px 0; line-height:1.5;"
            @click.capture="handleClickContent($event,titleDetails)"
            class="content-details"
          ></p>
          <div class="QuestionHeader_footer_main">
            <div class="QuestionButtoGroup">
              <!-- <el-button type="primary">关注问题</el-button> -->
              <a href="#answer">
                <el-button type="primary">
                  <svg-icon icon-class="edit"></svg-icon>写回答
                </el-button>
              </a>
            </div>
            <div class="QuestionHeaderActions">
              <el-button
                type="info"
                @click="showInvited"
                v-if="!userInfo.isCustomerUser && !isCanEndState "
              >
                <svg-icon icon-class="invite"></svg-icon>邀请回答
              </el-button>

              <span style="margin-left:10px; color:#666">
                <svg-icon icon-class="reply" />
                {{list.length}}条评论
              </span>
              <span style="margin-top:10px;color:#666">
                <svg-icon icon-class="time" />
                {{titleDetails.Time | TimeChange}}
              </span>
            </div>
            <div class="result-topic" v-if="loadData.State!=2">
              <el-button
                @click="handleResultTopic(titleDetails)"
                v-if="isCanEndTopic"
                type="primary"
                plain
              >结贴</el-button>
              <el-button
                @click="handleResultTopicToNotice(titleDetails)"
                v-if="userInfo.id==titleDetails.User_Id&&userInfo.Role=='管理员'"
                type="info"
                plain
              >转为公告贴</el-button>
            </div>
          </div>
        </div>
      </div>
      <div class="list" v-for="item in list" :key="item.Id" :style="{background}">
        <div class="list-body">
          <div class="list_header-list">
            <!-- <img src="static/img/herder.png" alt /> -->
            <div>
              <p
                class="avator-color"
                :style="{background:onSelectColor(item.Name)}"
              >{{!!item.Name&&item.Name.substring(0,1)}}</p>
              <div class="user_detail">
                <div>{{item.Name}}</div>
              </div>
            </div>
            <!-- <img src="src/assets/imgs/user.jpg" alt /> -->
            <div style="line-height:40px;margin-right:10px;">{{item.CompanyName}}</div>
          </div>
          <!-- <p class="many-pople-like">0人赞同了该回答</p> -->
          <div style="width:860px;margin:0 auto;">
            <div
              v-html="ContentsChange(item.Contents)"
              class="list_item content-details"
              @click.capture="handleClickContent($event,item)"
            ></div>
            <div style="margin:10px 0;color:#8590A6">发布于 {{item.Time | TimeChange}}</div>
            <div class="list_bottom">
              <div>
                <!-- <span class="like-bottom">
              <svg-icon icon-class="like" title="点赞" class="white"></svg-icon>赞同 0
            </span>
            <span class="like-bottom">
              <svg-icon icon-class="unlike" title="反对"></svg-icon>
                </span>-->
                <span size="mini" title="留下脚印" @click="handleCollect(item)" class="withicon-button">
                  <svg-icon icon-class="footer"></svg-icon>留下脚印
                </span>
                <!-- <el-button size="mini" style="float:right;" title="禁止此层下载附件" round>
              <svg-icon icon-class="arrowdownload"></svg-icon>
              <svg-icon icon-class="bandownload"></svg-icon>
                </el-button>-->
                <span size="mini" @click="handleReply(item)" class="withicon-button">
                  <span v-if="item.IsEdite==0">
                    <svg-icon icon-class="reply"></svg-icon>回复
                  </span>
                  <span v-else>
                    <svg-icon icon-class="reply"></svg-icon>修改
                  </span>
                </span>
                <span
                  size="mini"
                  @click="handleDeleteReply(item)"
                  class="withicon-button"
                  v-if="userInfo.id==item.User_Id&&item.IsEdite==1"
                >
                  <svg-icon icon-class="delete"></svg-icon>删除
                </span>
                <!-- <span class="withicon-button">
                <svg-icon icon-class="sharp"></svg-icon>分享
              </span>
              <span class="withicon-button"> 
                <svg-icon icon-class="thank"></svg-icon>感谢
              </span>
              <span class="withicon-button"> 
                <svg-icon icon-class="more"></svg-icon>
                </span>-->
              </div>
              <div style="color:#909399">
                <span>第 {{list.length-item.index}} 楼</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="list-border" id="answer" v-if="loadData.State!=2||IsEditor">
        <div class="replay_center">
          <Editor
            :currentTopic="topicId"
            @onGetList="getList"
            :loadData="loadData"
            @onInviteReply="inviteDialog = true"
            :key="loadData.topicType"
            :topicType="loadData.topicType"
            :viewState="viewState"
          ></Editor>
        </div>
      </div>
    </div>
    <el-tooltip placement="top" content="回到顶部">
      <back-to-top
        :custom-style="myBackToTopStyle"
        :visibility-height="300"
        :back-position="0"
        transition-name="fade"
      />
    </el-tooltip>
    <el-dialog
      title="邀请回答"
      class="invit-dialog"
      key="邀请回答"
      append-to-body
      :visible.sync="inviteDialog"
      width="30%"
    >
      <!-- <span>这是一段信息</span> -->
      <!-- <inviteList
        type="invite"
        :inviteList="loadData"
        @onInviteUser="handleInviteUser"
      ></inviteList>-->

      <div class="card-main">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <div>
              <el-input
                v-if="false"
                placeholder="搜索"
                style="float: right; padding: 3px 0;width:200px;"
                size="mini"
                @change="handleSearch"
                @input="handleSearch"
              ></el-input>
            </div>
          </div>
          <div v-if="type=='link'">
            <div v-for="item in inviteListReplace" :key="item.TopicId" class="text item">
              <span class="title" :title="item.TopicTitle">{{item.TopicTitle}}</span>
              <el-button size="mini" @click="handleInviteReply(item)">复制链接</el-button>
            </div>
          </div>
          <div v-else>
            <el-tabs v-model="activeName">
              <el-tab-pane label="内部人员" name="first" class="invit-list">
                <div
                  @click="changeChecked(item,index)"
                  v-for="(item,index) in inviteListReplace"
                  :key="item.UserId"
                  :class="{'text item':true,'item3':(index+1)%3 ==0}"
                >
                  <el-checkbox-group
                    v-if="item.UserName !==''"
                    v-model="checkedArr"
                    @change="handleCheckedChange($event,item,index)"
                  >
                    <el-checkbox :label="item" :value="item" :key="index">{{item.UserName}}</el-checkbox>
                  </el-checkbox-group>
                </div>
              </el-tab-pane>
              <el-tab-pane
                label="客户"
                name="second"
                class="invit-list"
                v-if="userInfo.company_Id==1"
              >
                <div
                  @click="changeChecked(item,index)"
                  v-for="(item,index) in inviteCusList"
                  :key="item.UserId"
                  :class="{'text item':true,'item3':(index+1)%3 ==0}"
                >
                  <el-checkbox-group
                    v-if="item.UserName !==''"
                    v-model="checkedArr"
                    @change="handleCheckedChange($event,item,index)"
                  >
                    <el-checkbox :label="item" :value="item" :key="index">{{item.UserName}}</el-checkbox>
                  </el-checkbox-group>
                </div>
              </el-tab-pane>
            </el-tabs>
            <!-- <div  class="text item"></div> -->
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
    </el-dialog>
    <el-dialog key="引用回复" append-to-body :visible.sync="quoteDialog" width="60%" title="引用回复">
      <Editor
        :currentTopic="topicId"
        :quoteId="quoteId"
        :loadData="loadData"
        :quote="quote"
        @onGetList="handleCloseQuote"
      ></Editor>
    </el-dialog>
    <!-- 修改标题 -->
    <el-dialog
      title="新标题"
      append-to-body
      key="新标题"
      class="newTitledialog"
      :visible.sync="dialogVisibleTitle"
      width="30%"
    >
      <el-input
        type="textarea"
        :autosize="{ minRows: 3, maxRows: 6}"
        placeholder="请输入内容"
        v-model="textNewTitle"
      ></el-input>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisibleTitle = false">取 消</el-button>
        <el-button type="primary" @click="editTopicTitle">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改标题 -->
    <el-dialog title="人员状态" :visible.sync="viewStateDialogVisible" width="60%">
      <el-row :gutter="12">
        <el-col :span="8">
          <el-card shadow="hover" class="viewState-class">
            <h3 style="font-size:18px;font-weight:600;text-align:center;min-width:200px">本帖处于用户的待解决</h3>
            <ul>
              <li v-for="(item,index) in viewerState.LookedUsers" :key="index">{{item}}</li>
            </ul>
          </el-card>
        </el-col>
        <el-col :span="8">
          <el-card shadow="hover" class="viewState-class">
            <h3 style="font-size:18px;font-weight:600;text-align:center;min-width:200px">本帖处于用户的新话题</h3>
            <ul>
              <li v-for="(item,index) in viewerState.NoLookUsers" :key="index">{{item}}</li>
            </ul>
          </el-card>
        </el-col>
        <el-col :span="8">
          <el-card shadow="hover" class="viewState-class">
            <h3 style="font-size:18px;font-weight:600;text-align:center;min-width:200px">参与过回复的人员</h3>
            <ul>
              <li v-for="(item,index) in viewerState.ReplyedUser" :key="index">{{item}}</li>
            </ul>
          </el-card>
        </el-col>
      </el-row>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="viewStateDialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import {
  GetContents,
  topicState,
  collect,
  replyLoadData,
  invite,
  deleteReply,
  finishTopic,
  trunnotice,
  updateTitle,
  downFile, //下载文件
  lookTopic, //人员查看帖子状态
  getCustomers,
  checkjump //允许客户跳转
} from "@/api/Contents";
import Viewer from "viewerjs";
import "viewerjs/dist/viewer.css";
import Editor from "@/components/editor";
import BackToTop from "@/components/BackToTop";
import inviteList from "@/components/inviteList";
import { mapState } from "vuex";
import { getToken } from "@/utils/auth";

export default {
  name: "TopicSingle",
  components: {
    BackToTop,
    Editor,
    inviteList
  },
  data() {
    return {
      colorBox: [
        "#FB966E",
        "#FF9999",
        "#99CC33",
        "#FF9900",
        "#FF0033",
        "#FF8000",
        "#00AEAE",
        "#0066CC",
        "#8C8C00",
        "#8080C0",
        "#804040",
        "#8F4586",
        "#00EC00"
      ],
      list: [
        {
          Contents: ""
        }
      ], //回复列表
      activeName: "first",
      total: 0, //回复条数
      topicTitle: "", //帖子标题
      topicId: 0, //帖子ID
      inviteDialog: false, //邀请模态框
      dialogVisibleTitle: false, //修改标题
      textNewTitle: "", //新的标题
      isInvite: true, //显示邀请楼层
      //邀请选择
      type: "invite",
      inviteListReplace: [],
      checkIndex: "-1",
      checkClass: "unchecked",
      checkAll: false,
      checkedArr: [],
      isIndeterminate: true,
      checkItem: [],
      //邀请选择
      myBackToTopStyle: {
        right: "50px",
        bottom: "50px",
        width: "40px",
        height: "40px",
        borderRadius: "4px",
        lineHeight: "45px", // 请保持与高度一致以垂直居中
        background: "#e7eaf1" // 按钮的背景颜色
      },
      inviteCusList: [], //邀请客户列表
      selectCus: [], //选中的客户
      quoteDialog: false, //引用模态框
      quoteId: 0, //引用ID
      quote: {}, //引用内容
      loadData: {}, //初始化数据
      arrAll: [
        {
          UserId: -1,
          UserName: "邀请全部"
        },
        {
          UserId: -2,
          UserName: "邀请服务人员"
        },
        {
          UserId: -3,
          UserName: "邀请销售和服务"
        },
        {
          UserId: -4,
          UserName: "邀请客户和服务"
        }
      ],
      scroll: 0, //滚轮数据
      viewStateDialogVisible: false, //人员查看帖子状态模态框
      viewerState: {}, //人员查看帖子状态
      topicType: 0,
      titleDetails: {}, //帖子详情
      isCanEndTopic: false, //是否可以结贴
      isCanEndState: false,
      viewState:{},//关注状态

    };
  },
  computed: {
    ...mapState({
      userInfo: state => state.user.userinfo,
      background: state => state.app.background
    }),
    IsEditor() {
      //开发部公告
      if (this.topicType == 3) {
        return this.userInfo.company_Id == 1;
        // return this.userInfo.company_Id==1
      } else if (this.topicType == 4) {
        // console.log(this.userInfo.CompanyName)
        // console.log(this.list[0].CompanyName)
        return this.userInfo.CompanyName == this.titleDetails.CompanyName;
      } else {
        return false;
      }
    }
  },
  beforeRouteUpdate(to, from, next) {
    if (to.path == "/TopicSingle") {
      // console.log(this.userInfo.isCustomerUser);
      if (this.userInfo.isCustomerUser) {
        checkjump({ topicId: to.query.topicId })
          .then(res => {
            if (res.Success) {
              next();
            } else {
              this.$message.warning(res.ErrMes);
            }
          })
          .catch(err => {
            this.$message.warning("暂无权限进入此页面");
          });
      } else {
        this.onInitData(to.query.topicId);
        next();
      }
    }
    // don't forget to call next()
    // 主要就是这一步
  },
  created() {
    this.onPowerEnter()
      .then(res => {
        this.onInitData(this.$route.query.topicId);
        this.handleInviteCus();
      })
      .catch(err => {
        this.$message.warning(err);
        this.$router.go(-1);
      });
  },
  mounted() {
    // window.addEventListener("scroll", this.menuScroll);
    window.addEventListener("scroll", this.handleScroll);
  },
  updated() {
    this.$nextTick(() => {
      this.viewerId && this.viewerId.destroy();
      this.viewerId = new Viewer(this.$refs.QuestionPage, {
        title: false,
        toolbar: false,
        navbar: false
      });
    });
  },
  destroyed() {
    this.$store.commit("SET_TOPICTITLE", "");
    window.removeEventListener("scroll", this.handleScroll); //  离开页面清除（移除）滚轮滚动事件
  },
  methods: {
    /**检测客户是否有权限进入页面 */
    onPowerEnter() {
      return new Promise((resolve, reject) => {
        if (this.userInfo.isCustomerUser) {
          checkjump({ topicId: this.$route.query.topicId }).then(res => {
            if (res.Success) {
              resolve();
            } else {
              reject(res.ErrMes);
              // this.$router.go(-1)
            }
          });
        } else {
          resolve();
        }
      });
    },
    /**查看人员回帖状态 */
    handleViewState() {
      lookTopic({ TopicId: this.topicId }).then(res => {
        if (res.Success) {
          this.viewerState = res.Data;
          this.viewStateDialogVisible = true;
        } else {
          this.$message.warning(res.ErrMes);
        }
      });
    },
    //显示隐藏邀请xxx加入，如果是最后一条记录就不隐藏
    chageShow() {
      this.isInvite = !this.isInvite;
      this.getList();
      // console.log(this.list)
    },
    //修改帖子title
    showTopicTitle() {
      this.dialogVisibleTitle = true;
      this.textNewTitle = this.topicTitle;
    },
    CloseInvite() {},
    showInvited() {
      // this.onReplyLoadData();

      this.inviteDialog = true;
    },
    //Topic/updatetitle 修改标题  TopicId帖子ID   Content新标题  httput
    editTopicTitle() {
      let form = {};
      form.TopicId = this.$route.query.topicId;
      form.Content = this.textNewTitle;
      updateTitle(form).then(res => {
        if (res.Success) {
          this.$message.success("修改成功");
          this.dialogVisibleTitle = false;
          this.getList();
        } else {
          this.$message.warning(res.ErrMes);
          this.dialogVisibleTitle = false;
        }
      });
    },
    /**结贴 */
    handleResultTopic(row) {
      this.$confirm("此操作将结贴, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          finishTopic({ TopicId: row.T_id }).then(res => {
            if (res.Success) {
              this.$message.success("结贴成功");
              // this.$router.push({ path: "mytask" });
              setTimeout(() => {
                // window.colse()
                window.close();
              }, 1000);
            } else {
              this.$message.warning(res.ErrMes);
            }
          });
        })
        .catch(() => {});
    },
    /**结贴转为公告贴 */
    handleResultTopicToNotice(row) {
      this.$confirm("将此贴转化为公告贴, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          trunnotice({ TopicId: row.T_id })
            .then(res => {
              if (res.Success) {
                this.$message.success("成功");
                this.$router.push({ path: "mytask" });
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
    /**删除当前回复 */
    handleDeleteReply(row) {
      this.$confirm("此操作将删除该回复, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          deleteReply({ ReplyId: row.Id }).then(res => {
            if (res.Success) {
              this.$message.success("删除成功");
              this.getList();
            } else {
              this.$message.warningres.ErrMes;
            }
          });
        })
        .catch(() => {});
    },
    /**选择颜色 */
    onSelectColor(name) {
      if (name != undefined) {
        return this.colorBox[name.charCodeAt(0) % 13];
      }
    },
    /**初始化数据 */
    onInitData(topicId) {
      this.topicId = topicId;
      this.getList();
      this.onReplyLoadData();
    },
    /**点击内容 */
    handleClickContent(topic, row) {
      if (topic.target.search != undefined && topic.target.search != "") {
        let topicId = topic.target.search.split("=")[1];
        this.$router.push({ path: "TopicSingle", query: { topicId } });
      } else if (topic.target.hash && topic.target.hash.includes("topicId")) {
        let topicId = topic.target.hash.split("=")[1];
        this.$router.push({ path: "TopicSingle", query: { topicId } });
      }
      if (topic.target.dataset.attfileid) {
        let obj = {
          fileName: row.Attachment || topic.target.dataset.filename,
          topicId: row.T_id,
          replyId: row.Id,
          attFileId: topic.target.dataset.attfileid,
          token: getToken()
        };
        downFile(obj).then(res => {
          if (res.Success) {
            // location.href = res.Data.Rows
            window.open(res.Data.Rows);
          } else {
            this.$message.warning(res.ErrMes);
          }
        });
      }
    },
    /**邀请客户回答 */
    handleInviteCus() {
      getCustomers({ topicId: this.topicId }).then(res => {
        if (res.Success) {
          this.inviteCusList = res.Data.Rows;
        } else {
          this.$message.waring(res.ErrMes);
        }
      });
    },
    /**邀请用户回答问题 */
    handleInviteUser() {
      // console.log(user)
      if (this.checkedArr.length == 0) {
        this.$message.warning("请选择邀请用户");
      } else {
        let obj = {};
        // obj.UserIds = String(user.UserId);
        obj.UserIds = this.checkedArr.map(el => el.UserId);
        obj.UserIds = String(obj.UserIds);
        obj.TopicId = this.topicId;
        // console.log(obj)
        //TODO
        invite(obj).then(res => {
          if (res.Success) {
            this.$message.success("邀请成功");
            this.inviteDialog = false;
            // this.loadData={};
            // this.loadData.NotNoticeUser.splice(0);
            this.checkedArr = [];
            this.onReplyLoadData();
            this.handleInviteCus();
            this.getList();
          } else {
            this.$message.warning(res.ErrMes);
            this.inviteDialog = false;
          }
        });
      }
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
        this.inviteListReplace = this.loadData.NotNoticeUser.filter(el => {
          return el.UserName.includes(val);
        });
      } else {
        // this.inviteListReplace = this.$props.inviteList.filter(el => {
        //   return el.TopicTitle.includes(val);
        // });
      }
    },

    /**初始化列表 */
    onReplyLoadData() {
      //  this.loadData = {};
      replyLoadData({ topicId: this.$route.query.topicId })
        .then(res => {
          if (res.Success) {
            this.loadData = res.Data;
            this.topicType = res.Data.topicType;
            if (res.Data.State == 2) {
              this.isCanEndState = true;
            } else {
              this.isCanEndState = false;
            }
            this.viewState.topicType = res.Data.topicType
            this.viewState.IsJoin = res.Data.IsJoin
            this.viewState.createUser = res.Data.createUser


            // console.log(this.isCanEndState);
            //  this.loadData = JSON.parse(JSON.stringify(this.loadData))
            if (this.userInfo.company_Id == 1) {
              for (var i = 3; 0 <= i && i < 4; i--) {
                this.loadData.NotNoticeUser.unshift(this.arrAll[i]);
              }
            }

            this.inviteListReplace = this.onFilterConcern(
              this.loadData.NotNoticeUser
            );
            var obj = {
              UserName: ""
            };
            if (this.inviteListReplace.length % 3 != 0) {
              this.inviteListReplace.push(obj);
            }
            // console.log(this.loadData);
          } else {
            this.$message.warning(res.ErrMes);
          }
        })
        .catch(err => {
          this.$router.go(-1);
        });
    },
    /**过滤邀请人员 */
    onFilterConcern(row) {
      row = row.filter(el => {
        return this.$store.state.user.userinfo.id !== el.UserId;
      });
      if (this.$store.state.user.userinfo.company_Id !== 1) {
        return row.filter(el => {
          if (el.UserId == 4 || el.UserId == 5) {
            return false;
          } else {
            return true;
          }
        });
      } else {
        return row;
      }
    },
    /**留下脚印(收藏) */
    handleCollect(item) {
      let obj = {};
      obj.ReplyId = item.Id;
      obj.LimitScore = 0;
      collect(obj).then(res => {
        if (res.Success) {
          this.$message.success("收藏成功");
        } else {
          this.$message.warning(res.ErrMes);
        }
      });
    },
    /**关闭引用模态框 刷新页面 */
    handleCloseQuote() {
      this.quoteDialog = false;
      this.getList();
    },
    /**引用回复/修改 */
    handleReply(quote) {
      // console.log(id);
      this.quoteId = quote.Id;
      this.quote = quote;
      this.quoteDialog = true;
    },
    /**加载数据 */
    getList() {
      const loading = this.$loading({
        lock: true,
        text: "加载中",
        spinner: "el-icon-loading",
        background: "rgba(255, 255, 255, 0.7)"
      });
      GetContents({
        topicId: this.topicId
      })
        .then(res => {
          loading.close();
          if (res.Success) {
            if (res.Data.Title == null) {
              this.topicTitle = this.$route.query.title;
            } else {
              this.topicTitle = res.Data.Title;
              this.list = this.onFormatList(res.Data.Rows).reverse();
              this.titleDetails = { ...this.list[0] };
              this.list = this.list.splice(1, this.list.length);
              this.isCanEndTopic = res.Data.IsCanEndTopic;
            }
            //  console.log(this.topicTitle);
            this.total = res.Data.Total;
            if (this.$route.query.topicState == 1) {
              // this.editTopic();
              console.log(1111);
            }
          }
        })
        .catch(err => {
          loading.close();
        });
    },
    /**格式化list */
    onFormatList(rows) {
      // console.log(rows);
      return rows.filter((el, index, arr) => {
        // console.log(el)
        el.index = index;
        let content = el.Contents;
        let position = content.indexOf("<a ");
        while (position > -1) {
          if (content.indexOf("tId") > -1 || content.indexOf("topicId") > -1) {
            // console.log(el.Contents);
            // console.log(position)
            content =
              content.slice(0, position + 3) +
              'onclick="return false;"' +
              content.slice(position + 3);
            position = content.indexOf("<a ", position + 1);
            // console.log(el.Contents)
          } else {
            position = -1;
          }
        }
        el.Contents = content;
        if (el.Attachment !== null || el.Attachment != undefined) {
          if (
            el.Attachment.indexOf("/") != -1 ||
            el.Attachment.indexOf("\\") != -1
          ) {
            let name =
              el.Attachment.lastIndexOf("/") > el.Attachment.lastIndexOf("\\")
                ? el.Attachment.lastIndexOf("/")
                : el.Attachment.lastIndexOf("\\");
            name = el.Attachment.slice(name + 1);
            // console.log(name)
            el.Contents +=
              "<p><a href='/attached/file/" +
              el.Attachment +
              "' style='color:red;text-decoration:underline;cursor:pointer' target='_blank'>" +
              name +
              "</a></p>";
          }
        }

        if (this.isInvite) {
          return true;
        } else {
          if (
            index != rows.length - 1 &&
            (el.Contents.includes("邀请：") || el.Contents.includes("邀请:"))
          ) {
            return false;
          } else {
            return true;
          }
        }
      });
    },
    /**草稿贴 */
    editTopic() {
      let topicForm = {};
      topicForm.topicId = this.$route.query.topicId;
      topicState(topicForm).then(res => {});
    },
    /**监听滚轮 */
    handleScroll() {
      this.scroll =
        document.documentElement.scrollTop || document.body.scrollTop;
      // console.log(this.scroll)
      if (this.scroll > 200) {
        this.$store.commit("SET_TOPICTITLE", this.topicTitle);
      } else {
        this.$store.commit("SET_TOPICTITLE", "");
      }
    },
    ContentsChange(row) {
      // console.log(row);
      var str = "";
      if (row == undefined) {
        return "";
      }
      if (row.includes("邀请：") || row.includes("邀请:")) {
        str = '<p style="font-size:20px;color:#FF5151;">' + row + "</p>";
        return str;
      } else {
        str = `<p>${row} </p>`;
        return str;
      }
    }
  },
  filters: {
    TimeChange(row) {
      // console.log(row)

      if (row == undefined) {
        return "";
      }
      var d = new Date(row);
      var times =
        String(d.getFullYear()) +
        "-" +
        (d.getMonth() + 1 < 10
          ? "0" + (d.getMonth() + 1)
          : String(d.getMonth() + 1)) +
        "-" +
        (d.getDate() < 10 ? "0" + d.getDate() : String(d.getDate())) +
        " " +
        (d.getHours() < 10 ? "0" + d.getHours() : String(d.getHours())) +
        ":" +
        (d.getMinutes() < 10 ? "0" + d.getMinutes() : String(d.getMinutes())) +
        ":" +
        (d.getSeconds() < 10 ? "0" + d.getSeconds() : String(d.getSeconds()));
      return times;
    },
    ContentsChange(row) {
      // console.log(row);
      var str = "";
      if (row == undefined) {
        return "";
      }
      if (row.includes("邀请：") || row.includes("邀请:")) {
        str = '<p style="font-size:20px;color:#FF5151;">' + row + "</p>";
        //  console.log(str);
        return str;
      } else {
        // console.log(str);
        str = `<p>${row} </p>`;
        return str;
      }
    }
  }
};
</script>


<style rel="stylesheet/scss" lang="scss" scoped>
.QuestionPage {
  // border:1px solid red;
  background: rgb(246, 246, 246);
  // margin:-20px;
  // padding:0 200px;
}
.Topic_container {
  // border:1px solid red;
  // width: 1200px;
  margin: 0 auto;
}
.Topic_container .QuestionHeader {
  width: 100%;
  box-shadow: 0 1px 3px rgba(26, 26, 26, 0.1);
  // border:1px solid red;
  background: #fff;
  padding: 20px;
}
.Topic_container .QuestionHeader .QuestionHeader_main {
  padding: 10px 0;
  width: 860px;
  margin: 0 auto;
  // margin: 0 auto;
}
.Topic_container .QuestionHeader .QuestionHeader_main .title {
  margin: 12px 0 12px 0;
  font-weight: 600;
  font-size: 24px;
}
.QuestionHeader_footer_main {
  display: flex;
  justify-content: start;
  margin-top: 10px;
}
.QuestionHeader_footer_main .QuestionButtoGroup {
  margin-right: 13px;
}
.QuestionHeader_footer_main .QuestionHeaderActions {
  width: 500px;
  line-height: 39px;
}
.list {
  padding: 10px 0;
  // margin-top: 20px;
  // margin-bottom: 20px;
  // margin-left: 20px;
  display: flex;
  flex-direction: column;
  // border-bottom: 1px solid #efefef;
  background: #f6f6f6;
}
.list-body {
  display: flex;
  flex-direction: column;
  position: relative;
  width: 100%;
  margin: 0 auto;
  background: #fff;
  padding: 20px;
}
.list_header {
  width: 100%;
  // display: flex;
  // flex-direction: column;
  // align-items: center;
  // padding-bottom: 10px;
  // margin-bottom: 10px;
  border-bottom: 1px solid #ddd;
  line-height: 1.2;
  display: flex;
  justify-content: space-between;
  height: 50px;
  border-radius: 6px;
  padding: 5px;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  background: #ededed;
  img {
    // border: 1px solid gray;
    border-radius: 6%;
    height: 40px;
    width: 40px;
    // margin-left: 25px;
  }
  .user_detail {
    display: inline-block;
    margin-left: 10px;
    line-height: 40px;
  }
  span {
    margin-top: 8px;
    text-align: center;
  }
  .avatar {
    display: block;
    height: 32px;
    min-width: 32px;
    font-size: 20px;
    text-align: center;
    line-height: 28px;
    color: #fff;
    border-radius: 5px;
    box-sizing: border-box;
    opacity: 0.6;
  }
}
.list_header-list {
  width: 100%;
  // display: flex;
  // flex-direction: column;
  // align-items: center;
  // padding-bottom: 10px;
  // margin-bottom: 10px;
  border-bottom: 1px solid #ddd;
  line-height: 1.2;
  display: flex;
  justify-content: space-between;
  height: 50px;
  border-radius: 6px;
  padding: 5px;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  background: #ededed;
  img {
    // border: 1px solid gray;
    border-radius: 6%;
    height: 40px;
    width: 40px;
    // margin-left: 25px;
  }
  .user_detail {
    display: inline-block;
    margin-left: 10px;
    line-height: 40px;
  }
  span {
    margin-top: 8px;
    text-align: center;
  }
  .avatar {
    display: block;
    height: 32px;
    min-width: 32px;
    font-size: 20px;
    text-align: center;
    line-height: 28px;
    color: #fff;
    border-radius: 5px;
    box-sizing: border-box;
    opacity: 0.6;
  }
}
.list-border {
  // border-top: 1px solid #eee;
  // margin-top: 15px;
  padding: 20px 0;
  background: #fff;
  // width: 1000px;
  width: 100%;
  // margin: 0 auto;
}
// .replay_center {
//   min-width: 1000px;
//   // display: block;
// }
.reply_box {
  width: 300px;
  display: inline-block;
  text-align: center;
}
.list_item {
  // margin-left: 50px;
  min-height: 50px;
  padding-top: 10px;
  line-height: 1.5;
  word-break: break-word;
  width: 860px;
  margin: 0 auto;
}
.list_bottom {
  // border:1px solid red;
  width: 100%;
  height: 30px;
  // padding: 0 30px;
  line-height: 30px;
  display: flex;
  justify-content: space-between;
}

.withicon-button {
  color: #76839b;
  font-size: 14px;
  cursor: pointer;
  margin-right: 24px;
  // margin-left: 24px;
}
.many-pople-like {
  font-size: 14px;
  color: #8590a6;
  margin: 5px 0;
  // cursor: pointer;
}
.like-bottom {
  display: inline-block;
  height: 34px;
  padding: 0 10px;
  color: #0084ff;
  background: rgba(0, 132, 255, 0.1);
  font-size: 14px;
  line-height: 34px;
  cursor: pointer;
  border-radius: 3px;
}
.avator-color {
  width: 40px;
  height: 40px;
  display: inline-block;
  line-height: 40px;
  text-align: center;
  vertical-align: bottom;
  border-radius: 5px;
  color: #fff;
  opacity: 0.6;
}
.result-topic {
  display: inline-block;
  width: 200px;
  text-align: end;
}
//邀请列表css
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
.invit-list {
  display: flex;
  /* flex: 1; */
  flex-wrap: wrap;
  border: 1px solid #c0c4cc;
  border-radius: 5px;
  // border-top: 1px solid #c0c4cc;
  // border-left: 1px solid #c0c4cc;
  // justify-content: space-around
}
.invit-list /deep/ .el-checkbox__inner {
  border: 1px solid #c0c4cc;
}
.item {
  height: 35px;
  line-height: 27px;
  /* border-bottom: 1px solid #c0c4cc; */
  border-right: 1px solid #c0c4cc;
  width: 31%;
  margin-left: 7px;
}
.item3 {
  // border: 1px solid red;
  border-right: 0px solid #c0c4cc;
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
// .el-card__header{

// }
.card-main /deep/ .el-card__header {
  /* width: 480px; */
  padding: 0px 0px;
  border-bottom: 0px solid #c0c4cc;
}
.card-main /deep/ .el-card {
  /* width: 480px; */
  // padding: 0px 0px;

  border: 0;
}
.card-main /deep/ .el-card__body {
  padding: 0px;

  min-height: 260px;
  max-height: 500px;
  height: auto;
  overflow-y: auto;
  // border-left: 1px solid #c0c4cc;
}
.foot-btn {
  padding: 10px 20px 20px;
  text-align: right;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
}
.newTitledialog /deep/ .el-dialog__body {
  padding: 10px 10px;
}
.invit-dialog /deep/ .el-dialog {
  min-width: 470px;
  margin-top: 5vh !important;
}
.invit-dialog /deep/ .el-dialog__body {
  padding: 5px 10px;
}
.viewState-class ul li {
  border: 1px solid #ccc;
  display: inline-block;
  width: 140px;
  margin-left: 10px;
  margin-top: 5px;
}

.content-details {
  word-wrap: break-all;
}
</style>
