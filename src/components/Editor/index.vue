<template>
  <div style="padding:20px">
    <el-upload
      class="upload-demo"
      action
      :auto-upload="false"
      :on-change="handleFileChange"
      :file-list="fileList"
      :limit="1"
      :on-exceed="handleExceed"
    >
      <el-button size="small" type="text">添加附件</el-button>
    </el-upload>
    <div ref="editor" class="editClass"></div>
    <div class="addtion_select">
      <el-button @click="handleClickLink" type="warning">查看链接</el-button>
      <!-- <el-select v-model="selectSolve">
        <el-option
          v-for="item in solveQuestOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        ></el-option>
      </el-select>-->
      <!-- <el-button @click="handleSolve">解决</el-button> -->
      <!-- tag列表 -->
      <el-select v-model="selectTag" @change="handleSelectTag" placeholder="请选择标签名">
        <el-option v-for="item in TagList" :key="item.Id" :label="item.name" :value="item.Id"></el-option>
      </el-select>
      <el-button
        type="info"
        @click="hadnleDisappearTopic"
        v-show="quote==null"
        plain
        v-if="(topicType!=3&&topicType!=4)"
      >让他从我眼前消失吧</el-button>
      <el-button type="info" @click="handleInvite" v-show="quote==null" v-if="!CustomerUser">邀请回答</el-button>
      <span>
        <el-button @click="handleJoin" v-if="viewStateData.topicType!=3&&viewStateData.createUser!=createUser&&!viewStateData.IsJoin&&quote==null" key="join">我要加入</el-button>
        <el-button @click="handleExitView" v-if="viewStateData.topicType!=3&&viewStateData.IsJoin&&quote==null" key="exit">退出关注</el-button>
      </span>
      <el-button
        type="primary"
        style="float:right;"
        @click="handleReplyTopic"
        :loading="uploadLoading"
      >回帖</el-button>
    </div>
    <el-dialog title="查看链接" :visible.sync="linkDialog" width="30%" append-to-body>
      <inviteList :inviteList="linkList" type="link" @onInvite="handleInviteReply"></inviteList>
      <span slot="footer" class="dialog-footer">
        <el-button @click="linkDialog = false">取 消</el-button>
        <el-button type="primary" @click="linkDialog = false">确 定</el-button>
      </span>
    </el-dialog>
    <!-- <button v-on:click="getContent">查看内容</button> -->
  </div>
</template>

<script>
import E from "wangeditor";
import plugins from "./plugins";
import toolbar from "./toolbar";
import inviteList from "@/components/inviteList";
import {
  Disappera,
  Solveday,
  ReplyMessage,
  join,
  cancleAttention
} from "@/api/topic";
import { getAboutMessage } from "@/api/table";
import { getToken } from "@/utils/auth";
import { getOssMes } from "@/api/table";
import { getTag, updataTagTopic } from "@/api/addtag.js";
import axios from "axios";
import { mapState } from "vuex";

export default {
  name: "editor",
  components: {
    inviteList
  },
  props: {
    currentTopic: {
      type: [Number, String], //当前帖子ID
      default: () => {}
    },
    quoteId: {
      type: [Number, String], //引用ID
      default: () => {}
    },
    loadData: {
      type: Object,
      default: () => {}
    },
    quote: {
      type: Object,
      default: () => {}
    },
    topicType: {
      type: Number
    },
    viewState:{
      type:Object
    }
  },
  data() {
    return {
      editorContent: "", //编辑器内容
      linkDialog: false, //链接模态框
      fileList: [], //上传文件列表
      solveQuestOptions: [
        { value: "1|天", label: "今天" },
        { value: "3|天", label: "三天后" },
        { value: "5|天", label: "五天后" },
        { value: "1|星期", label: "一星期后" },
        { value: "2|星期", label: "两星期后" },
        { value: "3|星期", label: "三星期后" },
        { value: "1|月", label: "一个月后" },
        { value: "2|月", label: "两个月后" },
        { value: "-1|很久以后", label: "很久以后" }
      ], //解决时间选项
      selectSolve: "", //当前选中的时间
      linkList: [], //链接列表
      uploadLoading: false, //上传加载状态
      TagList: [], //标签列表
      selectTag: "", //选择的标签
      viewStateData:{}
    };
  },
  computed: {
    isHidden() {
      return this.topicType == 3 || this.topicType == 4;
    },
    ...mapState({
      CustomerUser: state => state.user.userinfo.isCustomerUser,
      createUser:state=>state.user.userinfo.id
    }),
  },
  watch: {
    quote(value) {
      if (value != null) {
        this.editor.txt.clear();
        if (value.IsEdite == 0) {
          this.editor.txt.html(
            "<blockquote style='display: block;border-left: 8px solid #d0e5f2;padding: 5px 10px;margin: 10px 0;line-height: 1.4;font-size: 100%;background-color: #ccc;'>" +
              "@" +
              this.quote.Name +
              "：" +
              this.quote.Contents +
              "</blockquote>"
          );
          // this.editor.txt.append("<br>");
          this.editor.txt.append("<br>");
          this.editorContent =
            "<blockquote style='display: block;border-left: 8px solid #d0e5f2;padding: 5px 10px;margin: 10px 0;line-height: 1.4;font-size: 100%;background-color: #ccc;'>" +
            "@" +
            this.quote.Name +
            "：" +
            this.quote.Contents +
            "</blockquote>";
        } else {
          this.editor.txt.html(this.quote.Contents);
          this.editorContent = this.quote.Contents;
        }
      }
    }
  },
  created() {
    this.getTagList();
  },
  methods: {
    /**加入讨论 */
    handleJoin() {
      join({ topicId: this.currentTopic }).then(res => {
        if(res.Success){
          this.$message.success("加入成功")
          this.viewStateData.IsJoin = !this.viewStateData.IsJoin

        }else{
          this.$message.warning(res.ErrMes)
        }
      });
    },
    /**退出关注 */
    handleExitView() {
      cancleAttention({ topicId: this.currentTopic }).then(res => {
        if(res.Success){
          this.$message.success("退出成功")
          setTimeout(()=>{
            history.back(-1)
          },1000)
        }else{
          this.$message.warning(res.ErrMes)
        }
      });
    },
    /**邀请人员 */
    handleInvite() {
      this.$emit("onInviteReply");
    },
    /** 获取文件后缀名*/
    _splitExtension(name) {
      let index = name.lastIndexOf(".");
      let result = name.substring(index + 1, name.length);
      return result;
    },
    /**上传文件改变 */
    handleFileChange(file, fileList) {
      this.fileList = fileList;
    },
    /**文件个数超过 */
    handleExceed() {
      this.$message.warning("最多上传一个文件");
    },
    /**查看链接 */
    handleClickLink() {
      this.linkDialog = true;
      // this.initData()
      this.linkList = this.loadData.LinkTopic;
    },
    /**初始化链接列表 */
    // initData(){
    //   getAboutMessage().then(res=>{
    //     if(res.Success){
    //       this.linkList = res.Data.TopicList
    //     }else{
    //       this.$message.warning(res.ErrMes)
    //     }
    //   })
    // },
    /**上传附件 */
    onSubmitAtt() {
      return new Promise((resolve, reject) => {
        if (this.fileList.length != 0) {
          let file = this.fileList[0];
          this.uploadLoading = true;
          getOssMes(file).then(res => {
            if (res.Success) {
              //创建文件
              let formData = new FormData();
              //表头信息
              let config = {
                headers: {
                  "Content-Type": "multipart/form-data"
                }
              };
              let name = this._splitExtension(file.name);
              //添加文件信息
              formData.append("policy", res.Data.policy);
              formData.append("OSSAccessKeyId", res.Data.accessid);
              formData.append("success_action_status", "200");
              formData.append("signature", res.Data.signature);
              formData.append("region", res.Data.oshost);
              formData.append("dir", res.Data.dir);
              formData.append("name", res.Data.AttFileId + "." + name);
              formData.append(
                "key",
                res.Data.dir + res.Data.AttFileId + "." + name
              );
              formData.append("file", file.raw);
              axios
                .post(res.Data.oshost, formData, config)
                .then(success => {
                  if (success.status == 200) {
                    // this.editor.txt.append(
                    //   `<a class="wscnph" title="点击下载" onclick='messagedown("${res.Data.AttFileId}","${file.name}")'> ${file.name} </a>`
                    // );
                    this.editorContent +=
                      "<p style='margin-top:20px;'><b style='font-weight:600;font-size:18px;'>下载：</b></p>";
                    this.editorContent +=
                      "<span data-AttFileId='" +
                      res.Data.AttFileId +
                      "' data-fileName='" +
                      file.name +
                      "' style='color:red;text-decoration:underline;cursor:pointer'>" +
                      file.name +
                      "</span>";
                    this.editor.txt.append(
                      "<span data-AttFileId='" +
                        res.Data.AttFileId +
                        "' data-fileName='" +
                        file.name +
                        "' style='color:red;text-decoration:underline;cursor:pointer'>" +
                        file.name +
                        "</span>"
                    );
                    resolve(file.name);
                  }
                })
                .catch(error => {
                  // console.log(error)
                  reject();
                  this.uploadLoading = true;
                  this.$message.warning("文件上传失败,请重新上传");
                });
            }
          });
        } else {
          this.uploadLoading = true;
          resolve("");
        }
      });
    },
    /**回帖 */
    handleReplyTopic() {
      this.onSubmitAtt().then(res => {
        let obj = {};
        /**是否有附件 */
        if (this.quote != null) {
          // this.editor.txt.append("<blockquote>" + this.quote.Contents + "</blockquote>")
          // this.editorContent += "<blockquote>" + this.quote.Contents + "</blockquote>"
          // this.editor.txt =
          //   "<blockquote>" + this.quote.Contents + "</blockquote>";
          obj.ReplyType = 2; //回复类型  0 直接回复  2指定回复(修改)
          obj.TopicId = this.$props.currentTopic;
          obj.Content = this.editor.txt.html();
          obj.FileName = res;
          obj.ReplyId = this.quoteId;
          if (!!this.quoteId && this.quote.IsEdite == 0) {
            obj.Location = "";
            obj.ReplyType = 2; //回复类型  0 直接回复  2指定回复(修改)
          } else {
            obj.ReplyType = 2; //回复类型  0 直接回复  2指定回复(修改)
            obj.Location = "EditLastReply";
          }
        } else {
          obj.Content = this.editor.txt.html();
          obj.TopicId = this.$props.currentTopic;
          obj.FileName = res;
        }
        let str = obj.Content.replace(/<br>/g, "");
        str = str.replace(/\<p\>\<\/p\>/g, "");
        str = str.trim();
        if (obj.Content == null || obj.Content == "" || str == "") {
          this.uploadLoading = false;
          this.$message.warning("请输入内容");
        } else {
          ReplyMessage(obj).then(res => {
            if (res.Success) {
              this.editor.txt.clear();
              this.uploadLoading = false;
              // editor.txt.clear()
              this.$emit("onGetList");
              this.fileList.splice(0);
              this.editorContent = "";
              this.editor.txt.clear();
            } else {
              this.uploadLoading = false;
              this.$message.warning(res.ErrMes);
            }
          })
        }
      });
    },
    /**让它从我眼前消失 */
    hadnleDisappearTopic() {
      // console.log(this.$props.currentTopic)
      Disappera({ TopicId: this.$props.currentTopic }).then(res => {
        // console.log(res)
        if (res.Success) {
          this.$message.success("成功");
          setTimeout(() => {
            // window.close();
            history.back(-1)
          }, 1000);
        } else {
          this.$message.warning(res.ErrMes);
        }
      });
    },
    /**解决 */
    handleSolve() {
      let obj = {};
      // [obj.Day,obj.Unit] = this.selectSolve.includes("|")?this.selectSolve.split("|"):["",""]
      // console.log(this.selectSolve)
      if (this.selectSolve.includes("|")) {
        obj.Day = Number(this.selectSolve.split("|")[0]);
        obj.Unit = this.selectSolve.split("|")[1];
      }
      obj.TopicId = Number(this.$props.currentTopic);
      // console.log(this.selectSolve.split("|"))
      // console.log(obj)
      if (obj.Day == null || obj.Day == "") {
        this.$message.warning("请选择解决时间");
      } else {
        Solveday(obj).then(res => {
          if (res.Success) {
            this.$message.success("操作成功");
            setTimeout(() => {
              this.$router.go(-1);
            }, 1000);
          } else {
            this.$message.warning(res.ErrMes);
          }
        });
      }
    },
    /**复制链接到编辑器 */
    handleInviteReply(topic) {
      this.editor.txt.append(
        '<p><a style="color:red;text-decoration:underline" target="_blank" href="/TopicSingle?tId=' +
          topic.TopicId +
          '">' +
          topic.TopicTitle +
          "</a></p>"
      );
      this.editorContent +=
        '<p><a style="color:red;text-decoration:underline" target="_blank" href="/TopicSingle?tId=' +
        topic.TopicId +
        '">' +
        topic.TopicTitle +
        "</a></p>";
    },
    //获取tag列表
    getTagList() {
      getTag().then(res => {
        this.viewStateData = {...this.viewState}
        if (res.Success) {
          this.TagList = res.Data.Rows;
        }
      });
    },
    handleSelectTag(val) {
      let form = {};
      form.topicId = this.currentTopic;
      form.tagId = val;
      updataTagTopic(form).then(res => {
        if (res.Success) {
          this.$message.success("成功");
        } else {
          this.$message.warning(res.ErrMes);
        }
      });
    }
  },
  mounted() {
    this.editor = new E(this.$refs.editor);
    this.editor.customConfig.onchange = html => {
      this.editorContent = html;
    };
    this.editor.customConfig.uploadImgShowBase64 = true;
    this.editor.customConfig.pasteFilterStyle = false;
    this.editor.create();
    if (this.quote != null) {
      this.editor.txt.clear();
      if (this.quote.IsEdite == 0) {
        this.editor.txt.html(
          "<blockquote style='display: block;border-left: 8px solid #d0e5f2;padding: 5px 10px;margin: 10px 0;line-height: 1.4;font-size: 100%;background-color: #ccc;::after:content:123123'>" +
            "@" +
            this.quote.Name +
            "：" +
            this.quote.Contents +
            "</blockquote>"
        );
        // this.editor.txt.append("<br>");
        this.editor.txt.append("<br>");
        this.editorContent =
          "<blockquote style='display: block;border-left: 8px solid #d0e5f2;padding: 5px 10px;margin: 10px 0;line-height: 1.4;font-size: 100%;background-color: #ccc;'>" +
          "@" +
          this.quote.Name +
          "：" +
          this.quote.Contents +
          "</blockquote>";
      } else {
        this.editor.txt.html(this.quote.Contents);
        this.editorContent = this.quote.Contents;
      }
    }
  }
};
</script>

<style scoped>
.addtion_select {
  /* border:1px solid red; */
  margin-top: 10px;
}
.editClass {
  opacity: 0.99;
}
</style>
