<template>
  <div class="login-container" ref="login">

    <div class="login-weaper animated bounceInDown">
        <div class="login-left">
              <div class="login-time">
                {{time}}
              </div>
              <img class="img" src="@/assets/img/logo.png" alt="">
              <p class="title">Marcs管理系统</p>
        </div>

        <div class="login-border">
          <div class="login-main">
            <h4 class="login-title">
              欢迎登录
            </h4>

              <el-form ref="loginForm" 
              status-icon
              :model="loginForm" 
              :rules="loginRules" 
              class="login-form" 
              label-width="0" 
              label-position="left">
                <el-form-item prop="username">
                  <el-input
                    ref="username" size="small" 
                    v-model="loginForm.username"
                    placeholder="用户名"
                    name="username"
                    type="text"
                    tabindex="1"
                    auto-complete="off"
                  >
                      <i slot="prefix" class="iconfont icon-yonghu"></i>
                  </el-input>
                </el-form-item>

                <el-form-item prop="password">
                  <el-input
                    :key="passwordType"
                    ref="password"
                    size="small"
                    v-model="loginForm.password"
                    :type="passwordType"
                    placeholder="密码"
                    name="password"
                    tabindex="2"
                    auto-complete="off"
                    @keyup.enter.native="handleLogin">
                    <i slot="prefix" class="iconfont icon-mima"></i>
                    <i class="el-icon-view el-input__icon" slot="suffix" @click="showPwd"/>
                  </el-input>
                  
                </el-form-item>

                <el-form-item prop="code">
                    <el-row :span="24">
                      <el-col :span="16">
                         <el-input 
                            v-model="loginForm.code"
                            size="small"
                            placeholder="请输入验证码"
                            auto-complete="off">
                            <i slot="prefix" class="iconfont icon-yanzhengyanzhengma"></i>
                          </el-input>
                      </el-col>

                      <el-col :span="8">
                        <div class="login-code">
                            <img :src="codesrc" class="login-code-img" @click="getCode"/>
                        </div>
                      </el-col>
                    </el-row>
                </el-form-item>

                <el-form-item>
                  <el-button type="primary"
                            size="small"
                            :loading="loading"
                            @click.native.prevent="handleLogin"
                            class="login-submit">登录
                  </el-button>
                </el-form-item>

          </el-form>

          </div>

        </div>


    </div>

  

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

  </div>
</template>

<script>
import { getUserInfo } from '@/utils/auth'
import {dateFormat} from "@/utils/date";


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
      codesrc:'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7',
      uuid:'',
      time: ''
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
     this.getTime()
  },
  methods: {
    getTime() {
        setInterval(() => {
          this.time = dateFormat(new Date());
        }, 1000);
    },
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
@import "@/styles/login.scss";
</style>


<style lang="scss" scoped>
.username{
  color: black;
}
</style>
