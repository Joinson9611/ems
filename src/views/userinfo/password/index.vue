<template>
  <div class="app-container" style="margin-top: 20px">
    <el-form ref="formEditUserInfo" :model="UserInfo" :rules="UserInfoRule" label-width="80px">
      <el-form-item label="账号名称">
        <el-input v-model="UserInfo.u_name" type="text" disabled/>
      </el-form-item>
      <el-form-item label="员工姓名" prop="u_nickname">
        <el-input v-model="UserInfo.u_nickname" type="text" disabled/>
      </el-form-item>
      <el-form-item label="旧密码" prop="u_old_password">
        <el-input v-model="UserInfo.u_old_password" type="password"/>
      </el-form-item>
      <el-form-item label="新密码" prop="u_new_password">
        <el-input v-model="UserInfo.u_new_password" type="password"/>
      </el-form-item>
      <el-form-item label="确认密码" prop="u_password_confirm">
        <el-input v-model="UserInfo.u_password_confirm" type="password"/>
      </el-form-item>
      <el-form-item style="margin-top: 40px">
        <el-button v-waves :loading="isButtonSubmitLoadingShow" type="primary" @click.native="onSubmit">提交</el-button>
        <el-button v-waves @click.native="onCancel">返回</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import waves from '@/directive/waves'
import { setUserInfo } from '@/api/users'
import md5 from '@/utils/md5'
import { mapGetters } from 'vuex'

export default {
  name: 'Index',
  directives: { waves },
  data() {
    const validatePasswordConfirm = (rule, value, callback) => {
      if (value === undefined || value !== this.UserInfo.u_new_password) {
        callback(new Error('请确保两次输入的密码一致'))
      } else {
        callback()
      }
    }
    const validatePasswordLength = (rule, value, callback) => {
      if (value === undefined || value.length < 6) {
        callback(new Error('新密码的长度不能低于6位'))
      } else {
        callback()
      }
    }
    return {
      isButtonSubmitLoadingShow: false,
      UserInfoRule: {
        u_nickname: [{ required: true, message: '请输入员工姓名', trigger: 'blur' }],
        u_old_password: [{ required: true, message: '请输入旧的用户密码', trigger: 'blur' }],
        u_new_password: [{ required: true, validator: validatePasswordLength, trigger: 'blur' }],
        u_password_confirm: [{ required: true, validator: validatePasswordConfirm, trigger: 'blur' }]
      },
      UserInfo: {
        u_name: undefined,
        u_nickname: undefined,
        u_old_password: undefined,
        u_new_password: undefined,
        u_password_confirm: undefined
      }
    }
  },
  computed: {
    ...mapGetters([
      'user_name',
      'nick_name'
    ])
  },
  created() {
    this.setUserInfo()
  },
  methods: {
    /**
     * @Description: 初始化显示
     * @Date: 2021/8/30
     **/
    setUserInfo() {
      this.UserInfo.u_nickname = this.nick_name
      this.UserInfo.u_name = this.user_name
    },
    /**
     * @Description: 返回上一页
     * @Date: 2021/8/30
     **/
    onCancel() {
      this.$router.go(-1)
    },
    /**
     * @Description: 提交修改
     * @Date: 2021/8/30
     **/
    onSubmit() {
      this.$refs.formEditUserInfo.validate(valid => {
        if (valid) {
          this.isButtonSubmitLoadingShow = true
          const params = {
            u_nickname: this.UserInfo.u_nickname,
            u_old_password: md5.hexMD5(this.UserInfo.u_old_password + 'fiot_salt'),
            u_new_password: md5.hexMD5(this.UserInfo.u_new_password + 'fiot_salt')
          }
          setUserInfo(params).then(() => {
            this.isButtonSubmitLoadingShow = false
            this.$message({
              message: '密码修改成功，请尽快重新登录',
              type: 'success'
            })
          }).catch(err => {
            this.isButtonSubmitLoadingShow = false
            console.log(err)
          })
        }
      })
    }
  }
}
</script>

