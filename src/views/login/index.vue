<template>
  <div class="login-container">
    <el-form
      class="login-form"
      :model="loginForm"
      :rules="loginRules"
      ref="loginForm"
      label-position="left"
    >
      <h3 class="title">ET协同研发平台</h3>
      <el-form-item prop="username">
        <span class="svg-container svg-container_login">
          <svg-icon icon-class="user" />
        </span>
        <el-input name="username" type="text" v-model="loginForm.username" placeholder="用户名/手机号" />
      </el-form-item>
      <el-form-item prop="password">
        <span class="svg-container">
          <svg-icon icon-class="password"></svg-icon>
        </span>
        <el-input
          name="password"
          :type="pwdType"
          @keyup.enter.native="handleLogin"
          v-model="loginForm.password"
          placeholder="密码"
        ></el-input>
        <span class="show-pwd" @click="showPwd">
          <svg-icon icon-class="eye" />
        </span>
      </el-form-item>
      <div style="margin-top:45px;padding:0 3px;">
        <span class="button-class">
          <el-button
            type="primary"
            style="width:100%;"
            :loading="loading"
            @click.native.prevent="handleLogin"
          >登录</el-button>
          <!-- <el-button
            v-show="!showMehods"
            style="width:100%;margin-left:0;"
            @click.native.prevent="handleQRcodeLeave"
          >返回账户登录</el-button>-->
          <el-button
            @mouseover.native="handlegetQcode"
            @mouseout.native="handleQRcodeLeave"
            class="qrcode"
          >
            <svg-icon icon-class="qrcode" />
          </el-button>
        </span>
        <el-button @click="handleForgetPWD" type="text" style="float:right;margin-top:10px;">忘记密码</el-button>
        <div id="qrCode" ref="qrCodeDiv" v-show="!showMehods"></div>
        <p
          v-show="!showMehods"
          style="color:#fff;text-align:center;margin-top:20px;"
        >可使用企业微信 [ET代理商小助手] 扫描登录</p>
      </div>
      <!-- <el-form-item>
        <el-button
          @mouseover.native="handlegetQcode"
          style="width: 100%;"
          v-show="showMehods"
        >二维码登录</el-button>
        <el-button
          @mouseleave.native="handleQRcodeLeave"
          style="width: 100%;margin:0; margin-top:16px;"
          v-show="!showMehods"
        >账号登录</el-button>
      </el-form-item>-->
    </el-form>
  </div>
</template>

<script>
import { isvalidUsername } from "@/utils/validate";
import { setToken } from "@/utils/auth";
import { getQcode, scanQCode, forgetpwd } from "@/api/login";
import QRCode from "qrcodejs2";
export default {
  name: "login",
  data() {
    return {
      loginForm: {
        username: "",
        password: ""
      },
      loginRules: {
        username: [
          { required: true, trigger: "blur", message: "请输入用户名/手机号" }
        ],
        password: [{ required: true, trigger: "blur", message: "请输入密码" }]
      },
      loading: false,
      pwdType: "password",
      showMehods: true,
      QRCode: null,
      time: null,
      qr: "",
      forgetPWDDialog: false, //忘记密码模态框
      expCode: "", //验证码
      expPhone: "" //验证手机
    };
  },
  destroyed() {
    clearInterval(this.time);
  },
  created() {
    this.getQrcode();
    if(this.$route.query.token){
      this.onTokenLogin(this.$route.query.token)
    }
  },
  methods: {
    /**获取token登录 */
    onTokenLogin(token){
      // console.log(token)
      setToken(token)
      this.$store.commit('SET_TOKEN', token)
      this.$router.push({ path: "/mytask/index" });
    },
    /**忘记密码 */
    handleForgetPWD() {
      this.$prompt("请输入手机号", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        inputPattern: /^1([38]\d|5[0-35-9]|7[3678])\d{8}$/,
        inputErrorMessage: "手机格式不正确"
      })
        .then(({ value }) => {
          forgetpwd({ phone: value }).then(res => {
            if (res.Success) {
              this.$message.success("发送成功");
            } else {
              this.$message.warning(res.ErrMes);
            }
          });
        })
        .catch(() => {});
      // if (this.loginForm.username == "") {
      //   this.$message.warning("请输入手机号");
      // } else {
      //   forgetpwd({ phone: this.loginForm.username }).then(res => {
      //     if (res.Success) {
      //       this.$message.success("发送成功");
      //     } else {
      //       this.$message.warning(res.ErrMes);
      //     }
      //   });
      // }
    },
    getQrcode() {
      getQcode().then(res => {
        if (res.Success) {
          this.qr = "LoginLock_" + res.Data.Rows.LoginCode.split("_")[1];
          // this.showMehods = !this.showMehods;
          this.QRCode = new QRCode(this.$refs.qrCodeDiv, {
            text: this.qr,
            width: 200,
            height: 200,
            colorDark: "#333", //二维码颜色
            colorLight: "#fff", //二维码背景色
            correctLevel: QRCode.CorrectLevel.L //容错率，L/M/H
          });
        }
      });
    },
    /**获取二维码 */
    handlegetQcode() {
      if (this.time == null) {
        this.time = setInterval(() => {
          scanQCode({ qcode: this.qr }).then(code => {
            if (code.Success) {
              setToken(code.Token);
              // commit('SET_TOKEN', response.Token)
              this.$store.commit("SET_TOKEN", code.Token);
              this.$router.push({ path: "/mytask/index" });
            }
          });
        }, 3000);
      }
      this.showMehods = false;
      // if (this.time == null) {

      // }
    },
    handleQRcodeLeave() {
      this.showMehods = true;
      // setTimeout(() => {
      // clearInterval(this.time);
      // }, 21000);
      // clearInterval(time);
    },
    showPwd() {
      if (this.pwdType === "password") {
        this.pwdType = "";
      } else {
        this.pwdType = "password";
      }
    },
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true;
          this.$store
            .dispatch("Login", this.loginForm)
            .then(res => {
              this.loading = false;
              if (res.Success) {
                this.$router.push({ path: "/mytask" });
              } else {
                this.$message.error(res.ErrMes);
              }
            })
            .catch(() => {
              this.loading = false;
            });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    }
  }
};
</script>

<style rel="stylesheet/scss" lang="scss">
$bg: #2d3a4b;
$light_gray: #eee;

/* reset element-ui css */
.login-container {
  .el-input {
    display: inline-block;
    height: 47px;
    width: 85%;
    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      color: $light_gray;
      height: 47px;
      &:-webkit-autofill {
        -webkit-box-shadow: 0 0 0px 1000px $bg inset !important;
        -webkit-text-fill-color: #fff !important;
      }
    }
  }
  .el-form-item {
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    color: #454545;
  }
}
</style>

<style rel="stylesheet/scss" lang="scss" scoped>
$bg: #2d3a4b;
$dark_gray: #889aa4;
$light_gray: #eee;
.login-container {
  position: fixed;
  height: 100%;
  width: 100%;
  background-color: $bg;
  .login-form {
    position: absolute;
    left: 0;
    right: 0;
    width: 520px;
    padding: 35px 35px 15px 35px;
    margin: 120px auto;
  }
  .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;
    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }
  .svg-container {
    padding: 6px 5px 6px 5px;
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
    text-align: center;
    &_login {
      font-size: 20px;
    }
  }
  .title {
    font-size: 26px;
    font-weight: 400;
    color: $light_gray;
    margin: 0px auto 40px auto;
    text-align: center;
    font-weight: bold;
  }
  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }
  #qrCode {
    text-align: center;
    display: flex;
    justify-content: center;
    margin-top: 45px;
  }
  .qrcode {
    margin-left: 20px;
    padding: 0 30px;
  }
  .button-class {
    display: flex;
    justify-content: space-between;
  }
}
</style>
