<template>
  <div class="login-container">
    <el-form ref="loginForm" :model="loginForm" :rules="loginRules" class="login-form" auto-complete="on" label-position="left">

      <div class="title-container">
        <img class="logo" src="@/assets/img/logo.png">
        <h3 class="title">登录</h3>
      </div>

      <el-form-item prop="username">
        <span class="svg-container">
          <svg-icon icon-class="user" />
        </span>
        <el-input
          ref="username"
          v-model="loginForm.username"
          placeholder="1"
          name="username"
          type="text"
          tabindex="1"
          auto-complete="on"
        />
      </el-form-item>

      <el-form-item prop="password">
        <span class="svg-container">
          <svg-icon icon-class="password" />
        </span>
        <el-input
          :key="passwordType"
          ref="password"
          v-model="loginForm.password"
          :type="passwordType"
          placeholder="密码"
          name="password"
          tabindex="2"
          auto-complete="on"
          @keyup.enter.native="handleLogin"
        />
        <span class="show-pwd" @click="showPwd">
          <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
        </span>
      </el-form-item>

      <el-form-item prop="code">
          <!-- <span class="svg-container">
            <svg-icon icon-class="password" />
          </span> -->
          <el-input
          ref="code"
          v-model="loginForm.code"
          placeholder="请输入验证码"
          name="username"
          type="text"
          tabindex="3"
          auto-complete="off"/>
          <span @click="getCode">
`             <img class="codeimage" :src="codesrc" ></img>
          </span>
      </el-form-item>

      

      <el-button :loading="loading" type="primary" style="width:100%;margin-bottom:30px;" @click.native.prevent="handleLogin">登录</el-button>

      <!-- <div class="tips">
        <span style="margin-right:20px;">username: admin</span>
        <span> password: any</span>
      </div> -->

      <el-dialog title="" 
      :visible.sync="dialogRoleVisible"
      width="50%"
      :before-close="handleClose"
      :modal-append-to-body = "false">
        <el-table 
        :data="rolelist"
        @current-change="chooesRole"       
        :header-cell-style='getCellStyle'>
          <el-table-column property="roleName" label="请选择本次登录角色" align="center"></el-table-column>
        </el-table>
      </el-dialog>

    </el-form>
  </div>
</template>

<script>
import { getUserInfo } from '@/utils/auth'

export default {
  name: 'Login',
  data() {
    const validateUsername = (rule, value, callback) => {
      if (value.length <= 0) {
        callback(new Error('用户名不能为空'))
      } else {
        callback()
      }
    }
    const validatePassword = (rule, value, callback) => {
      if (value.length <= 0) {
        callback(new Error('密码不能为空'))
      } else {
        callback()
      }
    }

    const validateCode = (rule, value, callback) => {
      if (value.length <= 0) {
        callback(new Error('验证码不能为空'))
      } else {
        callback()
      }
    }
    return {
      loginForm: {
        username: '',
        password: '',
        code: ''
      },
      loginRules: {
        username: [{ required: true, trigger: 'blur', validator: validateUsername }],
        password: [{ required: true, trigger: 'blur', validator: validatePassword }],
        code: [{ required: true, trigger: 'blur', validator: validateCode }],
      },
      loading: false,
      passwordType: 'password',
      redirect: undefined,
      dialogRoleVisible:false,
      rolelist:[],
      currentRole:null,
      codesrc:'',
      uuid:''
    }
  },
  watch: {
    $route: {
      handler: function(route) {
        this.redirect = route.query && route.query.redirect
      },
      immediate: true
    }
  },

  created(){
     this.getCode()
  },
  methods: {
    showPwd() {
      if (this.passwordType === 'password') {
        this.passwordType = ''
      } else {
        this.passwordType = 'password'
      }
      this.$nextTick(() => {
        this.$refs.password.focus()
      })
    },
    getCode(){
       this.$api.post('system/getVerify',{}).then(resp =>{
         this.codesrc = resp.image
         this.uuid = resp.uuid
       })
    },
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        let param = {
          username: this.loginForm.username,
          password:this.loginForm.password,
          code:this.loginForm.code,
          uuid:this.uuid
        }
        if (valid) {
          this.loading = true
          this.$store.dispatch('user/login', param).then(() => {
            let userinfo = getUserInfo()
            this.rolelist = userinfo.roleList
            // 多角色的话让用户选择角色 单角色的话直接进入
            this.loading = false
            if(this.rolelist.length > 1 ){
                this.dialogRoleVisible = true
            }else{
                this.$store.dispatch('user/chooseRole',this.rolelist[0])
                this.$router.push({ path: this.redirect || '/' })
            }  
          }).catch(() => {
            this.loading = false
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    getCellStyle(){
      return {"color":"#fff","background":"rgba(48, 65, 86, 0.86)","padding":"8","text-align":"center"}
    },
    handleClose(done){
       if(this.currentRole == null){
           this.$message({
              showClose: true,
              message: '您还没有选择角色，请双击角色进行选择',
              type: 'error'
            });
       }else{
         //关闭窗口
         done()
       }
    },
    //选择角色
    chooesRole(role){
      this.currentRole = role
      this.dialogRoleVisible = false
      this.$store.dispatch('user/chooseRole',role)
      this.$router.push({ path: this.redirect || '/' })
    }
  }
}
</script>

<style lang="scss">
/* 修复input 背景不协调 和光标变色 */
/* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */

$bg:#283443;
$light_gray:#fff;
$cursor: #fff;

@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
  .login-container .el-input input {
    color: $cursor;
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
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      color: $light_gray;
      height: 47px;
      caret-color: $cursor;

      &:-webkit-autofill {
        box-shadow: 0 0 0px 1000px $bg inset !important;
        -webkit-text-fill-color: $cursor !important;
      }
    }
  }

  .el-table .cell{
    line-height: 40px;
    padding: 6px;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    font-weight: bold;
    font-size: 16px;
  }

  .el-form-item {
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    color: #454545;
  }
}
</style>

<style lang="scss" scoped>
$bg:#2d3a4b;
$dark_gray:#889aa4;
$light_gray:#eee;

.el-table__row{
  color: #606266;
  padding: 3px;
}

.login-container {
  min-height: 100%;
  width: 100%;
  background-color: $bg;
  overflow: hidden;

  .login-form {
    position: relative;
    width: 520px;
    max-width: 100%;
    padding: 160px 35px 0;
    margin: 0 auto;
    overflow: hidden;
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
    padding: 6px 5px 6px 15px;
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
  }

  .title-container {
    position: relative;
    text-align: center;
    
    .logo{
      width: 15%;
      margin-bottom: 12px;
    }
    .title {
      font-size: 26px;
      color: $light_gray;
      margin: 0px auto 20px auto;
      text-align: center;
      font-weight: bold;
    }
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

  .codeimage{
    width: 100px;
    height:  40px;
    position: absolute;
    right: 5px;
    top: 3px;
    cursor: pointer;
  }
}
</style>
