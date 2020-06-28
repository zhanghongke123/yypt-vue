<template>
  <div class="navbar">
    <hamburger :is-active="sidebar.opened" class="hamburger-container" @toggleClick="toggleSideBar" />

    <breadcrumb class="breadcrumb-container" />

    <div class="right-menu">
       <div class="right-menu-item"><span>部门:【 {{user.deptName}}】</span></div>
       <div class="right-menu-item"><span>角色:【 {{role.roleName}}】</span></div>
       <div class="right-menu-item"><span>欢迎【 {{user.realName}}】 登录</span></div>


      <template v-if="device!=='mobile'">
        
        <search id="header-search" class="right-menu-item" />
        <screenfull id="screenfull" class="right-menu-item hover-effect" />



      </template>


      <el-dropdown class="avatar-container" trigger="click">
        <div class="avatar-wrapper">
          <img :src="avatar" class="user-avatar">
          <i class="el-icon-caret-bottom" />
        </div>
        <el-dropdown-menu slot="dropdown" class="user-dropdown">
          <router-link to="/">
            <el-dropdown-item>
              首页
            </el-dropdown-item>
          </router-link>
          <el-dropdown-item divided>
              <span style="display:block;" @click="dialogUpdatePwd = true">修改密码</span>
          </el-dropdown-item>
          <el-dropdown-item divided>
            <span style="display:block;" @click="logout">登出</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>

  <el-dialog width="30%" title="修改密码" :visible.sync="dialogUpdatePwd" :modal-append-to-body="false" :close-on-click-modal="false">
    <el-form :model="pwdForm" ref="pwdForm" :rules="rules">
      <el-form-item label="原  密  码" prop="oldPwd">
        <el-input type="password" v-model="pwdForm.oldPwd"></el-input>
      </el-form-item>
      <el-form-item label="新密码" prop="newPwd1">
        <el-input type="password" v-model="pwdForm.newPwd1"></el-input>
      </el-form-item>
      <el-form-item label="确认密码" prop="newPwd2">
        <el-input type="password" v-model="pwdForm.newPwd2"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="dialogUpdatePwd = false">取 消</el-button>
      <el-button type="primary" @click="confirmUpdatePwd">确 定</el-button>
    </div>
  </el-dialog>




  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Screenfull from '@/components/Screenfull'
import Breadcrumb from '@/components/Breadcrumb'
import Hamburger from '@/components/Hamburger'
import Search from '@/components/HeaderSearch'


export default {
  components: {
    Breadcrumb,
    Hamburger,
    Screenfull,
    Search
  },
  computed: {
    ...mapGetters([
      'sidebar',
      'device'
    ]),
    user: user => JSON.parse(localStorage.getItem('userinfo')),
    role: role => JSON.parse(localStorage.getItem('currentrole')),
    roleList: roleList => JSON.parse(localStorage.getItem('userinfo')).roleList
  },
  data(){
    return {
      avatar: require('@/assets/avatar/zhk.jpg'),
      dialogUpdatePwd:false,
      pwdForm:{
        oldPwd:'',
  			newPwd1:'',
        newPwd2:''
      },
      rules:{
          oldPwd:[{required:true,message:'请输入原密码',trigger:'blur'}],
          newPwd1:[{required:true,message:'请输入新密码',trigger:'blur'}],
          newPwd2:[{required:true,message:'请确认密码',trigger:'blur'}],
      }
    }
  },
  methods: {
    toggleSideBar() {
      this.$store.dispatch('app/toggleSideBar')
    },
    async logout() {
      await this.$store.dispatch('user/logout')
      this.$router.push(`/login?redirect=${this.$route.fullPath}`)

    },
    confirmUpdatePwd(){
       this.$refs['pwdForm'].validate((valid) => {
        if (valid) {
            if(this.pwdForm.newPwd1 != this.pwdForm.newPwd2){
                this.$message.error('两次密码不一致')
                return false;
            }
            const req = {
              username:this.user.userName,
              oldPwd:this.pwdForm.oldPwd,
              newPwd1:this.pwdForm.newPwd1,
              newPwd2:this.pwdForm.newPwd2
            }
            this.$api.post('sysuser/updatePwd',req).then(resp =>{
              this.dialogUpdatePwd = false
              this.logout()
            })

            
          } else {
            return false;
          }
        });

    }
  }
}
</script>

<style lang="scss" scoped>
.navbar {
  height: 50px;
  overflow: hidden;
  position: relative;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0,21,41,.08);

  .hamburger-container {
    line-height: 46px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background .3s;
    -webkit-tap-highlight-color:transparent;

    &:hover {
      background: rgba(0, 0, 0, .025)
    }
  }

  .breadcrumb-container {
    float: left;
  }

  .right-menu {
    float: right;
    height: 100%;
    line-height: 50px;

    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      color: #5a5e66;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background .3s;

        &:hover {
          background: rgba(0, 0, 0, .025)
        }
      }
    }

    .avatar-container {
      margin-right: 30px;

      .avatar-wrapper {
        margin-top: 5px;
        position: relative;

        .user-avatar {
          cursor: pointer;
          width: 40px;
          height: 40px;
          border-radius: 10px;
        }

        .el-icon-caret-bottom {
          cursor: pointer;
          position: absolute;
          right: -20px;
          top: 25px;
          font-size: 12px;
        }
      }
    }
  }
}
</style>
