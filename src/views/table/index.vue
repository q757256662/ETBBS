<template>
  <div class="topic_main">
    <!-- submitTopic 标准发帖 -->
    <p class="submitMethod" v-if="!CustomerUser">
      <router-link to="/submitTopic/index">
        <el-button type="text">模板发帖</el-button>
      </router-link>
    </p>
    <el-form
      v-if="!CustomerUser"
      ref="SubmitTopicForm"
      :rules="Rules"
      :model="SubmitForm"
      class="question-top"
      label-width="100px"
      label-position="left"
    >
      <el-form-item prop="TopicTitle" maxlength="11" label="帖子主题">
        <el-input class="topic_head" v-model="SubmitForm.TopicTitle" placeholder="主题"></el-input>
      </el-form-item>
      <el-form-item
        label="指明关注人"
        prop="FocusUserId"
        v-if="!(SubmitForm.TopicTypeId=='3'||SubmitForm.TopicTypeId=='4')"
      >
        <el-select
          @change="changeFocus($event)"
          v-model="SubmitForm.FocusUserId"
          placeholder="指明关注人"
        >
          <el-option
            v-for="item in optionsConcernPeople"
            :key="item.UserId"
            :label="item.UserName"
            :value="item.UserId"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="帖子类型" prop="TopicTypeId">
        <el-select @change="changeType($event)" v-model="SubmitForm.TopicTypeId" placeholder="帖子类型">
          <el-option
            v-for="item in optionsTopicType"
            :key="item.value"
            :label="item.label"
            :value="item.value"
            v-if="item.role.includes(isBY)"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="加急状态">
        <el-switch @change="changeHot" v-model="checkedUrgency" active-color="#13ce66"></el-switch>
        <!-- <el-checkbox @change="changeHot" v-model="checkedUrgency">紧急</el-checkbox> -->
      </el-form-item>
      <el-form-item label="限制分">
        <el-input v-model="SubmitForm.Score" type="number"></el-input>
      </el-form-item>

      <el-form-item prop="Phone" maxlength="11" label="师傅手机号">
        <el-input v-model="SubmitForm.Phone"></el-input>
        <el-button type="primary" @click="checkPhone">检查手机号</el-button>
      </el-form-item>
      <el-form-item label="最近话题">
        <el-select
          @change="changeSelect($event)"
          :collapse-tags="true"
          size="medium"
          v-model="SubmitForm.LinkTopicIds"
          class="recent-topic"
          multiple
          placeholder="最近话题"
        >
          <el-option
            v-for="item in optionsTopic"
            :key="item.TopicId"
            :label="item.TopicTitle"
            :value="item.TopicId"
          ></el-option>
        </el-select>
        <el-button type="primary" @click="copyTopic">复制到编辑器</el-button>
      </el-form-item>
      <el-form-item label="自定义关键词">
        <el-input placeholder="请输入关键字" v-model="KeyName"></el-input>
      </el-form-item>
      <el-form-item label="关键词" class="keyword-class" prop="checkedKeyword">
        <!-- <el-select v-model="checkedKeyword" multiple allow-create default-first-option filterable collapse-tags>
          <el-option
            v-for="keyWord in keyWords"
            :label="keyWord.KeyName"
            :key="keyWord.KeyName"
            :value="keyWord.KeyId"
          >{{keyWord.KeyName}}</el-option>
        </el-select>-->
        <el-checkbox-group v-model="checkedKeyword">
          <el-checkbox
            v-for="keyWord in keyWords"
            :label="keyWord.KeyName"
            :key="keyWord.KeyName"
            :value="keyWord.KeyId"
          ></el-checkbox>
        </el-checkbox-group>
      </el-form-item>
    </el-form>
    <el-form
      v-else
      ref="SubmitTopicForm"
      :rules="Rules"
      :model="SubmitForm"
      class="question-top"
      label-width="100px"
      label-position="left"
    >
      <el-form-item prop="TopicTitle" maxlength="11" label="帖子主题">
        <el-input class="topic_head" v-model="SubmitForm.TopicTitle" placeholder="主题"></el-input>
      </el-form-item>
    </el-form>
    <el-upload
      class="upload-demo"
      :headers="header"
      action
      :on-change="handleUploadChange"
      :auto-upload="false"
      :file-list="fileList"
      :limit="1"
      :on-exceed="handleExceed"
    >
      <el-button size="small" type="text">上传附件</el-button>
    </el-upload>
    <div ref="editor" class="editClass" style="text-align:left;opacity:0.9;"></div>
    <el-button
      type="primary"
      @click="subTopic"
      :loading="uploadLoading"
      style="margin-top:10px;float:right;"
    >发贴</el-button>
  </div>
</template>

<script>
import {
  getAboutMessage,
  checkTel,
  submitTopic,
  getOssMes,
  customerUserpostmessage,
} from "@/api/table";
import {
  uploadimg
} from "@/api/topic";
import { getToken, setToken, removeToken } from "@/utils/auth";
import { isvalidPhone } from "@/utils/validate";
import axios from "axios";
import E from "wangeditor";
import { mapState } from "vuex";
// import plugins from '@/components/Editor/plugins'
// import toolbar from '@/components/Editor/toolbar'

export default {
  data() {
    var validateKeyWord = (rule, value, callback) => {
      if (this.checkedKeyword == "" && this.KeyName == "") {
        callback(new Error("请选择关键词或者填写自定义关键词"));
      } else {
        callback();
      }
    };
    var validPhone = (rule, value, callback) => {
      if (value == "") {
        callback();
      } else if (!isvalidPhone(value)) {
        callback(new Error("请输入正确的11位手机号码"));
      } else {
        callback();
      }
    };
    return {
      uploadLoading: false, //发送状态
      SubmitForm: {
        TopicTitle: "", //标题
        FocusUser: "", //关注人
        FocusUserId: "",
        TopicType: "", //类型
        //关键字
        KeyName: "",
        IsHot: 0, //是否加急
        Score: 0, //分
        Phone: "", //手机
        TopicTypeId: "1", //发帖类型
        TopicContent: "", //内容
        LinkTopicIds: []
      },
      fileList: [] /**上传文件列表 */,
      checkedKeyword: [],
      KeyName: "",
      editor: "",
      editorContent: "",
      optionsConcernPeople: [], //关注人
      checkedUrgency: false, //紧急
      optionsTopic: [], //最近话题
      recentName: [],
      optionsTopicType: [
        {
          value: "1",
          label: "普通贴",
          role: [1, 0]
        },
        {
          value: "2",
          label: "私人贴",
          role: [1, 0]
        },
        {
          value: "3",
          label: "本公司公告贴",
          role: [1, 0]
        },
        {
          value: "4",
          label: "功能贴",
          role: [1]
        },
        {
          value: "5",
          label: "程序更新",
          role: [1]
        },
        {
          value: "6",
          label: "疑难解答",
          role: [1]
        },
        {
          value: "7",
          label: "其他开发部公告贴",
          role: [1]
        }
      ], //类型
      keyWords: [], //关键字
      fileList: [],
      headersData: {
        Authorization: "Bearer " + getToken()
      },
      common: {},
      header: { Authorization: "Bearer " + getToken() },
      ossFileForm: {
        fileName: "",
        sourceKey: "",
        fileSize: "",
        AttFileId: ""
      },
      Rules: {
        Phone: [
          {
            validator: validPhone,
            trigger: "blur"
          }
        ],
        TopicTitle: [
          {
            required: true,
            message: "主题不能为空",
            trigger: "blur"
          },
          {
            min: 1,
            max: 50,
            message: "长度在 1 到 50 个字符",
            trigger: "blur"
          }
        ],
        FocusUserId: [
          { required: true, message: "请指明关注人", trigger: "change" }
        ],
        TopicTypeId: [
          { required: true, message: "请选择帖子类型", trigger: "change" }
        ],
        checkedKeyword: [{ validator: validateKeyWord, trigger: "change" }]
      }
    };
  },
  created() {
    // this.fetchData()
    this.getValue();
  },
  computed: {
    ...mapState({
      CustomerUser: state => state.user.userinfo.isCustomerUser,
      userinfo: state => state.user.userinfo
    }),
    isBY() {
      if (this.userinfo.company_Id == 1) {
        return 1;
      } else {
        return 0;
      }
    }
  },
  methods: {
    /**列表上传改变 */
    handleUploadChange(file, fileList) {
      this.fileList = fileList;
    },
    /**文件个数超过 */
    handleExceed() {
      this.$message.warning("最多上传一个文件");
    },
    getContent: function() {
      // alert(this.editorContent)
    },
    getValue() {
      getAboutMessage().then(res => {
        if (res.Success == true) {
          this.optionsConcernPeople = this.onFilterConcern(res.Data.FocusUser);
          this.optionsTopic = res.Data.TopicList;
          this.keyWords = res.Data.KeyNames;
        }
      });
    },
    /**过滤邀请人员 */
    onFilterConcern(row) {
      // console.log(this.$store.state.user.userinfo.id)
      row = row.filter(el => {
        return this.$store.state.user.userinfo.id !== el.UserId;
      });
      if (
        this.$store.state.user.userinfo.CompanyName !==
        "（开发）深圳市布易科技有限公司"
      ) {
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
    checkPhone() {
      // console.log(this.SubmitForm.Phone)
      let checkForm = {};
      checkForm.Phone = this.SubmitForm.Phone;
      // console.log(this.$refs.SubmitTopicForm)
      this.$refs.SubmitTopicForm.validateField("Phone", (el, result) => {
        if (!result) {
          checkTel(checkForm).then(res => {
            if (res.Success) {
              this.$message.success("通过");
            } else {
              this.$message.warning(res.ErrMes);
            }
          });
        } else {
        }
      });
      // if (checkForm.Phone == "") {
      //   this.$message.warning("请输入手机号");
      // } else {
      //   checkTel(checkForm).then(res => {
      //     if (res.Success) {
      //       this.$message.success("通过");
      //     } else {
      //       this.$message.warning(res.ErrMes);
      //     }
      //   });
      // }
    },
    copyTopic() {
      this.recentName = [];
      this.optionsTopic.forEach((element, index) => {
        this.SubmitForm.LinkTopicIds.forEach((element2, index2) => {
          if (element.TopicId == element2) {
            this.recentName.push(element.TopicTitle);
            this.editor.txt.append(
              '<a style="color:red;text-decoration:underline" href="/TopicSingle?tId=' +
                element.TopicId +
                '">' +
                element.TopicTitle +
                "</a><br>"
            );
            this.editorContent +=
              '<a style="color:red;text-decoration:underline" href="/TopicSingle?tId=' +
              element.TopicId +
              '">' +
              element.TopicTitle +
              "</a><br>";
          }
        });
      });
      // this.editor.txt.append('<p>'+this.recentName+'</p>')
      // this.editorContent+='<p>'+this.recentName+'</p>'
      // console.log(this.recentName)
    },
    // 最近帖子
    changeSelect(event) {
      // console.log(this.SubmitForm.LinkTopicIds)
    },
    //关注人
    changeFocus(e) {
      // console.log(e)
      this.optionsConcernPeople.forEach(element => {
        // console.log(element)
        if (element.UserId == e) {
          this.SubmitForm.FocusUser = element.UserName;
          // console.log(this.SubmitForm.FocusUser)
        }
      });
    },
    //类型
    changeType(e) {
      // console.log(e)
      this.optionsTopicType.forEach(element => {
        if (element.value == e) {
          this.SubmitForm.TopicType = element.label;
        }
      });
    },
    //是否加急
    changeHot(e) {
      if (e) {
        this.checkedUrgency = true;
        this.SubmitForm.IsHot = 1;
      } else {
        this.checkedUrgency = false;
        this.SubmitForm.IsHot = 0;
      }
    },
    //关键字
    changeKeyname(e) {
      if (this.KeyName != "") {
        this.SubmitForm.KeyName = "";
        let str = this.checkedKeyword.join(",");
        this.SubmitForm.KeyName = this.KeyName + "," + str;
      } else {
        let str = this.checkedKeyword.join(",");
        this.SubmitForm.KeyName = str;
      }
    },
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
                    this.editorContent +=
                      "<span data-AttFileId='" +
                      res.Data.AttFileId +
                      "' data-fileName='" +
                      file.name +
                      "' style='color:red;text-decoration:underline;cursor:pointer'>" +
                      file.name +
                      "</span>";
                    resolve(file.name);
                  }
                })
                .catch(error => {
                  reject();
                  this.$message.warning("文件上传失败,请重新上传");
                });
            }
          });
        } else {
          resolve("");
        }
      });
    },
    /**替换文本 */
    handleReplyImg(html) {
      return new Promise((resolve, reject) => {
        if (html.indexOf('<img src="data:image') == -1) {
          resolve(html);
        }
        let imgArr = [];
        let str = html;
        var substr = str.match(/<img src=\"data:image(\S*)"/g);
        substr.map(el => {
          let str1 = el.slice(el.indexOf('"') + 1, el.length - 1);
          imgArr.push({
            FileName: "." + str1.slice(str1.indexOf("/") + 1, str1.indexOf(";")),
            BaseStr: str1
          });
        });
        uploadimg(imgArr).then(res => {
          if (res.Success) {
            let newStr = str;
            imgArr.map((el, index) => {
              newStr = newStr.replace(imgArr[index].BaseStr, res.Data[index]);
            });
            resolve(newStr);
          } else {
            reject(res.ErrMes);
          }
        });
      });
    },
    //发帖
    subTopic() {
      this.onSubmitAtt()
        .then(async res => {
          this.SubmitForm.FileName = res;
          try {
            // console.log()
            this.SubmitForm.TopicContent = await this.handleReplyImg(this.editorContent);
          } catch (error) {
            this.$message.warning(error);
          }
          // this.SubmitForm.KeyName = this.KeyName || this.checkedKeyword;
          // console.log(this.SubmitForm.KeyName)
          this.$refs["SubmitTopicForm"].validate(valid => {
            if (valid) {
              // if (
              //   this.SubmitForm.TopicContent == "" ||
              //   this.SubmitForm.TopicContent == null
              // ) {
              //   this.$message({
              //     message: "内容不能为空！",
              //     type: "warning"
              //   });
              // } else if (this.SubmitForm.KeyName == "") {
              //   this.$message({
              //     message: "关键字不能为空！",
              //     type: "warning"
              //   });
              // } else if (this.KeyName != "") {
              //   if (this.checkedKeyword == "") {
              //     this.SubmitForm.KeyName = this.KeyName;
              //   } else {
              //     this.SubmitForm.KeyName = "";
              //     let str = this.checkedKeyword.join(",");
              //     this.SubmitForm.KeyName = this.KeyName + "," + str;
              //   }
              // } else {
              //   let str = this.checkedKeyword.join(",");
              //   this.SubmitForm.KeyName = str;
              // }
              console.log(this.SubmitForm)
              if (this.CustomerUser) {
                this.SubmitForm.TopicTypeId = 1;
                this.SubmitForm.KeyName = "";
                customerUserpostmessage(this.SubmitForm).then(res => {
                  this.uploadLoading = false;
                  if (res.Success) {
                    this.$message.success("发贴成功");
                    setTimeout(() => {
                      this.$router.push("/mytask/index");
                    }, 1000);
                  } else {
                    this.$message.warning(res.ErrMes);
                  }
                });
              } else {
                if (this.KeyName != "") {
                  let result = this.checkedKeyword.push(this.KeyName);
                  this.SubmitForm.KeyName = this.checkedKeyword.join(",");
                } else {
                  this.SubmitForm.KeyName = this.checkedKeyword.join(",");
                }
                if (
                  this.SubmitForm.TopicTypeId == 3 ||
                  this.SubmitForm.TopicTypeId == 4
                ) {
                  this.SubmitForm.FocusUser = "";
                  this.SubmitForm.FocusUserId = 0;
                }
                submitTopic(this.SubmitForm).then(res => {
                  this.uploadLoading = false;
                  if (res.Success) {
                    this.$message.success("发贴成功");
                    setTimeout(() => {
                      this.$router.push("/mytask/index");
                    }, 1000);
                  } else {
                    this.$message.warning(res.ErrMes);
                  }
                });
              }
            }
          });
        })
        .catch(err => {
          console.log(err);
          this.uploadLoading = false;
          this.$message.warning("发布失败,请重新发布");
        });
      // }

      // ==============================================================
      // this.SubmitForm.TopicContent = this.editorContent;
      // this.SubmitForm.KeyName = this.KeyName || this.checkedKeyword;
      // // console.log(this.SubmitForm.KeyName)
      // this.$refs['SubmitTopicForm'].validate(valid => {
      //   if (valid) {
      //     if (this.SubmitForm.TopicContent == '' || this.SubmitForm.TopicContent == null) {
      //       this.$message({
      //         message: '内容不能为空！',
      //         type: "warning"
      //       })
      //     } else if (this.SubmitForm.KeyName == '') {
      //       this.$message({
      //         message: '关键字不能为空！',
      //         type: "warning"
      //       })
      //     } else if (this.KeyName != '') {
      //       if (this.checkedKeyword == '') {
      //         this.SubmitForm.KeyName = this.KeyName
      //       } else {
      //         this.SubmitForm.KeyName = '';
      //         let str = this.checkedKeyword.join(',')
      //         this.SubmitForm.KeyName = this.KeyName + ',' + str;
      //       }
      //     } else {
      //       let str = this.checkedKeyword.join(',')
      //       this.SubmitForm.KeyName = str;
      //     }
      //     submitTopic(this.SubmitForm).then(res => {
      //       if(res.Success){
      //         this.$message.success("发送成功")
      //         setTimeout(() => {
      //           this.$router.push("/mytask/index")
      //         }, 1000);
      //       }else{
      //         this.$message.warning(res.ErrMes)
      //       }
      //     })
      //   }
      // })
    },
    beforeUpload2(file) {
      // console.log(file);
      // this.fullscreenLoading = true;
      if (file.type.indexOf("image") != -1) {
        {
          this.$message.error("只能选择文件类型！");
          // this.fullscreenLoading = false;
          return false;
        }
      }
    },
    /** 获取文件后缀名*/
    _splitExtension(name) {
      let index = name.lastIndexOf(".");
      let result = name.substring(index + 1, name.length);
      return result;
    },
    //文件
    handleRemove(file, fileList) {
      console.log(file);
      console.log(fileList);
      //   this.handleClearUser()
    },
    // 上传之前的回调
    beforeUpload(file) {
      // console.log(file)
      // this.addFileInfo(file)
      //  this.editorContent += `<a class="wscnph" title="点击下载" onclick='messagedown("${this.ossFileForm.AttFileId}","${file.name}")'> ${file.name} </a>`
      //  this.getOssMsg();
      // this.TimeChange()
      // this.common.name = file.name;
      // this.common.key = this.common.dir + this.userId + this.TimeChange() + file.name;
      // this.common.key = 'ETDDS/2019/'+this.common.name;

      this.common.key = this.common.dir + this.common.name;
      this.ossFileForm.fileName = file.name;
      this.ossFileForm.sourceKey = this.common.key;
      // this.ossFileForm.fileSize = Math.round(file.size / 1024);
      this.ossFileForm.fileSize = file.size;
    },
    handleSubmit(row) {
      // console.log(row)
      //  row.action = this.common.region;
      let formData = new FormData();
      let config = {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      };
      formData.append("policy", this.common.policy);
      formData.append("OSSAccessKeyId", this.common.OSSAccessKeyId);
      formData.append(
        "success_action_status",
        this.common.success_action_status
      );
      formData.append("signature", this.common.signature);
      formData.append("region", this.common.region);
      formData.append("dir", this.common.dir);
      formData.append("name", this.common.name);
      formData.append("key", this.common.key);
      formData.append("file", row.file);
      this.$axios
        .post(this.common.region, formData, config)
        .then(res => {
          // this.handleSuccess(res)
          onSuccess(res.data);
          // console.log(this.fileList)
          //  if (res.status == 200) {
          //  this.editor.txt.append(`<a class="wscnph" title="点击下载" onclick='messagedown("${this.ossFileForm.AttFileId}","${this.ossFileForm.fileName}")'> ${this.ossFileForm.fileName} </a>`)
          // this.$message({
          //   message: "上传文件成功",
          //   type: "success"
          // });
          // }
        })
        .catch(res => {
          row.onError();
          // this.handleError(res)
          //   this.$message({
          //   message: "上传文件失败",
          //   type: "error"
          // });
          console.log(res);
        });
    },
    handleSuccess(response) {
      console.log("handleSuccess");
      // console.log(this.fileList)
      // if (response.status == 200) {
      //   this.$message({
      //     message: "上传文件成功",
      //     type: "success"
      //   });
      // }
      // console.log(this.ossFileForm)
      // postOssFile(this.ossFileForm).then(res => {
      //   if (res.status == 200) {
      //     this.$message({
      //       message: "上传文件成功",
      //       type: "success"
      //     });
      //     this.getInfo();
      //     this.fileList = [];
      //     // this.checkUser = [];
      //     // this.$refs.cusTab.clearSelection()
      //   } else {
      //     this.$message({
      //       message: "上传文件失败",
      //       type: "error"
      //     });
      //   }
      //   // fileList.splice(0, 1)
      //   this.fileList = [];
      // });
      this.handleClearUser();
    },
    handleClearUser() {},
    submitUpload() {},
    handleError(err) {
      console.log("handleError");
      // if (err) {
      //   this.$message({
      //     message: "上传文件失败",
      //     type: "error"
      //   });
      // }
    },
    //获取文件后缀名
    _splitExtension(name) {
      let index = name.lastIndexOf(".");
      let result = name.substring(index + 1, name.length);
      return result;
    }
  },
  mounted() {
    this.editor = new E(this.$refs.editor);
    this.editor.customConfig.onchange = html => {
      this.editorContent = html;
    };
    this.editor.customConfig.pasteFilterStyle = false;
    this.editor.customConfig.uploadImgShowBase64 = true;
    this.editor.create();
  }
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.topic_main {
  width: 900px;
  margin: 0px auto;
  background: #fff;
  padding: 20px;
}
.question-top .el-input__inner {
  border: 1px solid red !important;
}

.question-top .el-input {
  width: 400px;
}
.topic_head {
  // margin-bottom: 20px;
  // min-width: 1150px;
}
.upload-container /deep/ .el-upload {
  width: 10px !important;
}
.upload-container {
  border: 1px solid #e0e0e0;
  padding: 5px;
  margin: 5px 0px;
  background: #eef1f6; // height: 60px;
  width: 100%;
  display: flex;
  justify-content: start; // align-items: top;
  .editor-slide-upload {
    display: flex;
    align-content: center; // margin-bottom: 30px; // display: inline-block;
    width: 100%; // margin-right: 20px;
  }
  .editor-slide-upload /deep/ .el-upload-list {
    display: flex;
    align-items: start;
    display: -ms-inline-flexbox;
    border: 0px solid #e0e0e0; //  padding: 0 5px;
    margin-left: 5px; //  margin: 5px 0px;
    background: #eef1f6;
    overflow: auto;
    max-width: 87%; // height: 52px;
    .el-upload-list__item-name {
      color: #606266;
      display: block;
      margin-right: 40px;
      margin-left: 5px; // overflow: hidden;
      padding-left: 4px;
      margin-top: -2px;
      text-overflow: ellipsis;
      -webkit-transition: color 0.3s;
      transition: color 0.3s;
      /* white-space: nowrap; */
      /* display: inline-block; */
      border: 1px solid #20a0ff;
      border-radius: 5px;
      /* margin: 5px 10px; */
      /* text-align: center; */
      padding: 0 5px;
      /* padding-right: 10px; */
    }
    a {
      display: inline-block;
      border: 1px solid #20a0ff;
      background-color: rgba(32, 160, 255, 0.1);
      border-color: rgba(32, 160, 255, 0.2);
      border-radius: 5px;
      margin: 5px 10px;
      text-align: center;
      padding: 5px 0;
      padding-right: 10px;
    }
  }
  .editor-slide-upload /deep/ .el-upload-list li {
    // border: 1px solid red;
  }
}
.editor-slide-upload /deep/ .el-upload-list__item:first-child {
  margin-top: 5px;
}
::-webkit-scrollbar {
  /*滚动条整体样式*/
  width: 4px;
  /*高宽分别对应横竖滚动条的尺寸*/
  height: 4px;
}
::-webkit-scrollbar-thumb {
  /*滚动条里面小方块*/
  border-radius: 5px;
  -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
  background: rgba(0, 0, 0, 0.2);
}
::-webkit-scrollbar-track {
  /*滚动条里面轨道*/
  -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
  border-radius: 0;
  background: rgba(0, 0, 0, 0.1);
}
// .upload-demo {
//   display: flex;
//   justify-content: start;
//   border: 1px solid #ddd;
//   width: 100%;
//   /* overflow: auto; */
//   border-radius: 5px;
//   padding: 0 10px;
//   line-height: 45px;
// }
// .upload-demo .submit_btn {
//   position: relative;
//   top: -2px;
//   margin: 10px;
// }
.context-box {
  display: flex;
  justify-content: space-between;
  width: 100%;
  align-items: center;
  margin: 0 auto;
}
.el-upload__tip {
  text-align: center;
  margin: 0 20px;
}

.recent-topic .el-input__inner {
  border: 1px solid red !important;
  background: red;
}

.topic_main .el-select {
  width: 400px;
}

.topic_main .el-textarea {
  width: 400px;
}
.keyword-class {
  width: 600px;
}

.keyword-class .el-checkbox {
  width: 140px;
  margin-left: 0px;
}
.submitMethod {
  text-align: right;
}
</style>

