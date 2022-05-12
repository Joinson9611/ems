<template>
  <div class="login-container">
    <vue-particles
      :particle-opacity="0.8"
      :particles-number="80"
      :particle-size="4"
      :lines-width="2"
      :line-linked="true"
      :line-opacity="0.4"
      :lines-distance="150"
      :move-speed="2"
      :hover-effect="true"
      :click-effect="true"
      color="#3d44c0"
      shape-type="circle"
      lines-color="#3d44c0"
      hover-mode="grab"
      click-mode="push"
      class="particles"
    />
    <el-form ref="loginForm" :model="loginForm" :rules="loginRules" class="login-form" auto-complete="on" label-position="left">
      <h3 class="title">欢迎登录开拓灯控系统</h3>
      <el-form-item prop="username">
        <span class="svg-container">
          <svg-icon icon-class="user" />
        </span>
        <el-input v-model="loginForm.username" name="username" type="text" auto-complete="on" placeholder="请输入用户账号" />
      </el-form-item>
      <el-form-item prop="password">
        <span class="svg-container">
          <svg-icon icon-class="password" />
        </span>
        <el-input :type="pwdType" v-model="loginForm.password" name="password" auto-complete="on" placeholder="请输入用户密码" @keyup.enter.native="handleLogin" />
        <span class="show-pwd" @click="showPwd">
          <svg-icon :icon-class="pwdType === 'password' ? 'eye' : 'eye-open'" />
        </span>
      </el-form-item>
      <el-form-item v-if="isIndentifyEnabel" prop="indentifyCode">
        <span class="svg-container">
          <svg-icon icon-class="identify" />
        </span>
        <el-input v-model="loginForm.indentifyCode" class="identify-input" type="text" auto-complete="on" placeholder="请输入验证码"/>
        <span class="identify-container" @click="refreshCode">
          <Identify :identify-code="identifyCode"/>
        </span>
      </el-form-item>
      <el-button v-waves :loading="loading" type="primary" style="width:100%;height: 47px;" plain class="sub-btn sub2" @click.native.prevent="handleLogin">
        登 录
      </el-button>
    </el-form>
    <div class="footer">
      <span>Copyright ©2022 开拓网络 All Rights Reserved</span> <a href="https://beian.miit.gov.cn" target="_blank" >粤ICP备16092185号</a>
    </div>
  </div>
</template>

<script>
import { isvalidUsername } from '@/utils/validate'
import waves from '@/directive/waves'
import Identify from '@/components/Identify'

export default {
  name: 'Login',
  components: { Identify },
  directives: { waves },
  data() {
    const validateUsername = (rule, value, callback) => {
      if (!isvalidUsername(value)) {
        callback(new Error('请输入正确的用户名'))
      } else {
        callback()
      }
    }
    const validatePassword = (rule, value, callback) => {
      if (value.length < 6) {
        callback(new Error('密码不能小于6位'))
      } else {
        callback()
      }
    }
    const validateIndentify = (rule, value, callback) => {
      if (value.length !== 4) {
        callback(new Error('请输入正确的验证码'))
      } else {
        callback()
      }
    }
    return {
      isIndentifyEnabel: false,
      identifyCodes: '1234567890abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ',
      identifyCode: '',
      loginForm: {
        username: '',
        password: '',
        indentifyCode: ''
      },
      loginRules: {
        username: [{ required: true, trigger: 'blur', validator: validateUsername }],
        password: [{ required: true, trigger: 'blur', validator: validatePassword }],
        indentifyCode: [{ required: true, trigger: 'blur', validator: validateIndentify }]
      },
      loading: false,
      pwdType: 'password',
      redirect: undefined
    }
  },
  mounted() {
    this.identifyCode = ''
    this.makeCode(this.identifyCodes, 4)
  },
  methods: {
    /**
     * @Description: 密码输入框明文暗文转换
     * @Date: 2019/5/5
     **/
    showPwd() {
      if (this.pwdType === 'password') {
        this.pwdType = ''
      } else {
        this.pwdType = 'password'
      }
    },
    // 登录操作
    /**
     * @Description: 登录操作
     * @Date: 2019/5/5
     **/
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          if (this.isIndentifyEnabel) {
            // 启用验证码
            if (this.loginForm.indentifyCode.toLowerCase() === this.identifyCode.toLowerCase()) {
              this.loading = true
              this.$store.dispatch('Login', this.loginForm).then(() => {
                this.loading = false
                this.$router.push({ path: this.redirect || '/platform/projects' })
              }).catch(() => {
                this.resetInfo()
                this.loading = false
              })
            } else {
              this.resetInfo()
              this.$message({
                message: '验证码错误',
                type: 'error',
                duration: 3 * 1000
              })
              return false
            }
          } else {
            // 不启用验证码
            this.loading = true
            this.$store.dispatch('Login', this.loginForm).then(() => {
              this.loading = false
              this.$router.push({ path: this.redirect || '/platform/projects' })
            }).catch(() => {
              this.isIndentifyEnabel = true
              this.resetInfo()
              this.loading = false
            })
          }
        } else {
          return false
        }
      })
    },
    /**
     * @Description: 登录出现错误重置部分信息
     * @Date: 2019/5/5
     **/
    resetInfo() {
      this.loginForm.password = ''
      this.loginForm.indentifyCode = ''
      this.refreshCode()
    },
    /**
     * @Description: 刷新验证码
     * @Date: 2019/5/5
     **/
    refreshCode() {
      this.identifyCode = ''
      this.makeCode(this.identifyCodes, 4)
    },
    /**
     * @Description: 生成指定范围随机数
     * @Date: 2019/5/5
     **/
    randomNum(min, max) {
      return Math.floor(Math.random() * (max - min) + min)
    },
    /**
     * @Description: 生成验证码
     * @Date: 2019/5/5
     **/
    makeCode(o, l) {
      for (let i = 0; i < l; i++) {
        this.identifyCode += this.identifyCodes[ this.randomNum(0, this.identifyCodes.length) ]
      }
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss">
$bg:#2d3a4b;
$light_gray:#eee;

.identify-input{
  display: inline-block;
  height: 47px;
  width: 60% !important;
  input {
    background: transparent;
    border: 0;
    -webkit-appearance: none;
    border-radius: 0;
    padding: 12px 5px 12px 15px;
    color: $light_gray;
    height: 47px;
    &:-webkit-autofill {
      -webkit-box-shadow: 0 0 0 1000px $bg inset !important;
      -webkit-text-fill-color: #fff !important;
    }
  }
}

/* reset element-ui css */
.login-container {
  .el-input {
    display: inline-block;
    height: 47px;
    width: 85%;
    input {
      background: transparent;
      border: 0;
      -webkit-appearance: none;
      border-radius: 0;
      padding: 12px 5px 12px 15px;
      color: $light_gray;
      height: 47px;
      &:-webkit-autofill {
        -webkit-box-shadow: 0 0 0 1000px $bg inset !important;
        -webkit-text-fill-color: #fff !important;
      }
    }
  }
  .el-form-item {
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(0, 0, 0, 0.1);
    border-radius: 4px;
    color: #454545;
  }
}

</style>

<style rel="stylesheet/scss" lang="scss" scoped>
$bg:#2d3a4b;
$dark_gray:#889aa4;
$light_gray:#eee;
.login-container {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  width: 100%;
  // background-color: #000b32;
  background-image: url('../../assets/login_images/bg.jpg');
  background-size: cover;
  background-position: center;
  .particles {
    position: absolute;
    top: 0;
    right: 0;
    left: 0;
    bottom: 0;
    z-index: 10;
  }
  .login-form {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    width: 460px;
    max-width: 100%;
    padding: 35px 35px 15px 35px;
    z-index: 20;
  }
  .svg-container {
    padding: 6px 5px 6px 15px;
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
  }
  .identify-container {
    position: absolute;
    right: 6px;
    top: 6px;
    display: inline-block;
    vertical-align: middle;
  }
  .title {
    font-size: 26px;
    font-weight: 400;
    /*font-weight: bold;*/
    color: $light_gray;
    margin: 0 auto 40px auto;
    text-align: center;
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
  .sub2{
    margin-top: 15px;
    font-size: 16px;
    border-radius: 10px;
    color: #4194f6;
    background: none;
    border: 1px solid #4194f6;
  }
  .sub2:active {
    color: #FFF;
    background: #3a8ee6;
    border-color: #3a8ee6;
  }
  .footer {
    line-height: 50px;
    font-size: 12px;
    height: 50px;
    position: fixed;
    z-index: 30;
    bottom: 0;
    color: #929293;
    a:hover {
      color: #409EFF;
    }
  }
}
</style>
