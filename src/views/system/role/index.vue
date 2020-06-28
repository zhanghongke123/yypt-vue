<template>
  <div class="app-container" >
      <el-row>
          <el-col :xs="24" :sm="24" :md="24" :lg="14" :xl="14"  >
              <yypt-button v-permission='"role:add"' permission='role:add' @click="click('新增')"></yypt-button>
              <yypt-button v-permission='"role:edit"' permission='role:edit' @click="click('修改')"></yypt-button>
              <yypt-button v-permission='"role:delete"' permission='role:delete' @click="click('删除')"></yypt-button>

              <el-button type="primary" plain size="small" @click="fetchData()" >刷新</el-button>
              <!-- 角色对应的table -->
              <div class = "roletable">
                <el-table ref="roletable" height="35vh" style="width: 100%;margin-top: 10px;" v-loading="listLoading" :data="roledata"
                            row-key="roleId" border highlight-current-row @current-change="rowchange">
                        <el-table-column prop="roleId" label="ID" header-align="center" align="center"  min-width="100">
                        </el-table-column>

                        <el-table-column prop="roleName" label="角色名称" header-align="center" align="center"  min-width="150">
                        </el-table-column>

                        
                        <el-table-column prop="roleCode" label="排序" header-align="center" align="center"  min-width="80">
                        </el-table-column>

                        <el-table-column prop="memo" label="备注" header-align="center" align="center"  min-width="300">
                        </el-table-column>

                        <el-table-column prop="createDate" label="创建日期" header-align="center" align="center"  min-width="180">
                        </el-table-column>

                        <el-table-column prop="modifyDate" label="修改日期" header-align="center" align="center"  min-width="180">
                        </el-table-column>

                </el-table>
              </div>

              <!-- 角色人员对应的table-->
              <div class="roleusertable">
                <div class="roleuserbutton">
                     <yypt-button v-permission='"role:authuser"' permission='role:authuser' @click="click('授权人员')" ></yypt-button>
                     <yypt-button v-permission='"role:deleteroleuser"' permission='role:deleteroleuser' @click="click('删除角色人员')" ></yypt-button>
                </div>
             

                <el-table stripe ref="roleusertable" height="40vh" style="width: 100%;margin-top: 10px;" v-loading="userlistLoading" :data="roleuserdata"
                            row-key="roleUserId" border highlight-current-row @current-change="userrowchange">
                        <el-table-column prop="roleUserId" label="ID" header-align="center" align="center"  min-width="100">
                        </el-table-column>

                        <el-table-column prop="userName" label="用户名称" header-align="center" align="center"  min-width="150">
                        </el-table-column>

                        
                        <el-table-column prop="userId" label="用户ID" header-align="center" align="center"  min-width="80">
                        </el-table-column>

                        <el-table-column prop="roleId" label="角色ID" header-align="center" align="center"  min-width="80">
                        </el-table-column>

                        <el-table-column prop="createDate" label="创建日期" header-align="center" align="center"  min-width="180">
                        </el-table-column>

                </el-table>
              </div>


          </el-col>
          <el-col :xs="24" :sm="24" :md="24" :lg="5" :xl="5"  class="menu-panel">
              <div class="menu-text">
                <span>【{{ role.roleName }}】拥有的权限为</span>
              </div>
              <el-divider></el-divider>
              <div style="margin-left:10px;">
                <el-button size="mini" type="primary" plain :loading="savemenuing" @click="saverolemenu">保存{{role.roleName}}权限信息</el-button>
              </div>
              <el-tree ref="menutree" :data="menutreedata" @node-click='nodeclick'	 show-checkbox node-key="id" :props="defaultProps" 
              :default-checked-keys='selectMenus' default-expand-all>        
              </el-tree>

          </el-col>

          <el-col :xs="24" :sm="24" :md="24" :lg="5" :xl="5" class="menu-panel">
              <div class="menu-text">
                <span>【{{ currentNode.label }}】的按钮</span>
              </div>
              <el-divider></el-divider>
              <div style="margin-left:10px;" v-if="menubuttons != undefined && menubuttons.length > 0">
                <el-button size="mini" type="primary" plain :loading="savebuttoning" @click="saveRoleButtons">保存{{currentNode.label}}按钮信息</el-button>
              </div>
              <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange" v-if="menubuttons != undefined && menubuttons.length > 0">全选</el-checkbox>
              <el-checkbox-group v-model="buttonlist" @change="handleCheckedButtonChange">
                    <el-checkbox style="width:100%" v-for="button in menubuttons" :key="'check'+ button.buttonId" 
                    :label="button.buttonId"  >{{ button.name + "(" +button.permission+")"  }}</el-checkbox>
               </el-checkbox-group>

          </el-col>

      </el-row>
      <el-dialog title="添加角色" :visible.sync="dialogRoleVisible" >
          <el-form :model="role" ref="roleForm"  :rules="rules" label-width="80px" size='small'>
              <el-form-item prop="roleName" label="角色名称">
                  <el-input v-model="role.roleName"></el-input>
              </el-form-item>
              <el-form-item prop="roleCode" label="角色编码">
                  <el-input v-model="role.roleCode"></el-input>
              </el-form-item>

              <el-form-item prop="memo" label="备注">
                  <el-input v-model="role.memo"></el-input>
              </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer" style="text-align:center">
            <el-button @click="dialogRoleVisible = false">取 消</el-button>
            <el-button type="primary" @click="handRoleSave()">保存</el-button>
          </div> 

      </el-dialog>
      
      <el-dialog  title="选择角色人员" :visible.sync="showRoleUser" width="70%"  :destroy-on-close="true" :modal-append-to-body="false" >
        <userRep @ok="selectUser" @cancel="showRoleUser = false" :queryRoleId="role.roleId"></userRep>
      </el-dialog>
  </div>
</template>

<script>
import { list, getMenuTree, saveRoleMenu, getRoleButtons, saverRoleUser,
        saveRoleButtons, saveRole, delRole, getRoleUsers, delRoleUser } from '@/api/system/role'
import { getMenuButtons } from '@/api/system/menu'
import { validatenull } from '@/utils/validate'
import { deepClone } from '@/utils'
import userRep from './userrep'

const defaultrole = {
      roleId:null,
      roleName:'',
      roleCode:null,
      memo:''
}

  export default {
    name:'',
    props:[''],
    components:{
       userRep
    },
    data () {
      return {
          listLoading:true,
          roledata:[],
          menutreedata:[],
          role:Object.assign({},defaultrole),
          defaultProps:{
              children:'children',
              label: 'label'
          },
          selectMenus:[],
          buttonlist:[],
          currentNode:{},
          savemenuing:false,
          savebuttoning:false,
          currentrole:{},
          allmenu:[],
          allbutton:[],
          menubuttons:[],
          rolebuttons:{},
          dialogRoleVisible:false,
          roleEdit:false,
          rules:{
              roleName: [{ required: true, message: '角色名称不能为空', trigger: 'blur' }]
          },
          userlistLoading:false,
          roleuserdata:[],
          roleuser:{},
          checkAll: false,
          isIndeterminate: true,
          showRoleUser: false
          
      };
    },

    async created(){
      //获取所有菜单的树形信息
      await this.getMenu()
      //获取角色列表
      this.fetchData()
    },
    methods: {
        click(command){
          //获取当前选中的角色
          let currentRole = this.role
          if(command == "新增"){
             this.roleEdit = false
             this.role = Object.assign({},defaultrole)
             this.dialogRoleVisible = true
             this.$nextTick(() => {
                this.$refs['roleForm'].clearValidate()
             })  

          }else if(command == "修改"){
             this.roleEdit = true
             this.dialogRoleVisible = true
             this.$nextTick(() => {
                this.$refs['roleForm'].clearValidate()
             })              
          }else if(command == "删除"){
            this.$confirm(`是否删除【${this.role.roleName}】`, '警告', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(async() => {
                        await delRole(this.role)
                        this.$message({
                            type: 'success',
                            message: '删除成功'
                        })
                        this.updateData(true)
                    }).catch(err => {
                        console.error(err)
                    })   
          }else if(command == "授权人员"){
              if(this.role.roleId == undefined || this.role.roleId == undefined){
                    this.$message({
                            type:'error',
                            message: '请选择要操作的角色行'
                    })
                    return;
              }
              this.showRoleUser = true

          }else if(command == "删除角色人员"){
            this.$confirm(`是否删除【${this.roleuser.userName}】`, '警告', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(async() => {
                        await delRoleUser(this.roleuser)
                        this.$message({
                            type: 'success',
                            message: '删除成功'
                        })
                        this.getRoleUsers(this.role.roleId)
                    }).catch(err => {
                        console.error(err)
                    })               
          }
        },
        handRoleSave(){
            this.$refs['roleForm'].validate((vail) => {
                if(vail){
                  saveRole(this.role).then(data =>{
                        this.$message({
                            type:'success',
                            message: '保存成功'
                        })
                        this.role = data
                        if(this.roleEdit){
                           this.updateData(false)
                        }else{
                           this.roledata.push(this.role)
                        }
                        this.dialogRoleVisible = false
                            
                    }).catch( error =>{
                        console.error(error)
                    })
                }
            })
        },
        fetchData(){
            this.listLoading = true
            list({}).then(data =>{
            this.roledata = data
            this.listLoading = false
            if(this.roledata.length > 0){
                this.$refs['roletable'].setCurrentRow(this.roledata[0])
            }
          })
        },
        async getMenu(){
            await getMenuTree().then(data =>{
                this.menutreedata = data.treedata
                this.allmenu = data.allmenu
                this.allbutton = data.allbutton
            })
        },
        async getRoleButtons(roleId){
           const req = {
               roleId:roleId
           }
           await getRoleButtons(req).then(data =>{
               this.rolebuttons = data
           })
        },
        //获取角色用户
        async getRoleUsers(roleId){
             const req = {
               roleId:roleId
              }
              this.userlistLoading = true
            await getRoleUsers(req).then(data =>{
               this.roleuserdata = data
               this.userlistLoading = false
                if(this.roleuserdata.length > 0){
                    this.$refs['roleusertable'].setCurrentRow(this.roleuserdata[0])
                }
           })
        },
        rowchange(currentRow,oldCurrentRow){
            this.role = deepClone(currentRow)
            this.menubuttons = []
            this.buttonlist = []
            this.currentNode = {}
            //获取角色对应的所有按钮
            this.getRoleButtons(currentRow.roleId)
            const menuIds = currentRow.menuIds
            if(validatenull(menuIds)){
               this.selectMenus = []
            }else{
                let selectMenus = currentRow.menuIds.split(',').map(Number)
                let parentMenuids = []
                //由于el-tree 存在子级和父级联动的问题，所以需要设置父级为未选中
                //1.获取所有子级对应的父级ID
                for (let i = 0; i < selectMenus.length; i++) {
                    const menuId = selectMenus[i]
                    for (let j = 0; j < this.allmenu.length; j++) {
                        const menu = this.allmenu[j]
                        if(menu.menuId == menuId){
                           if(parentMenuids.indexOf(menu.parentid) == -1){
                               parentMenuids.push(menu.parentid)
                           }
                           break
                        }        
                    }
                }
                //去除父级的菜单
                let res = []
                selectMenus.forEach(element => {
                    //判断是否是父级菜单
                    if(parentMenuids.indexOf(element) == -1){
                         res.push(element)
                    }                   
                });           
               this.selectMenus = res
            }
            this.$refs['menutree'].setCheckedKeys(this.selectMenus)
            this.$refs['menutree'].setCurrentKey(1)
            this.getRoleUsers(this.role.roleId)
        },
        userrowchange(currentRow,oldCurrentRow){
            if(currentRow == null || currentRow == undefined){
                this.roleuser = {}
            }else{
                this.roleuser = deepClone(currentRow)
            }
        },
        saverolemenu(){
            this.savemenuing = true
            let result = []

            //获取选中状态和半选中状态的权限
            let selectMenuIdarry = this.$refs['menutree'].getCheckedKeys()
            let halfselectMenuId = this.$refs['menutree'].getHalfCheckedKeys()
            result = selectMenuIdarry.concat(halfselectMenuId)

            let data = {
                roleId: this.role.roleId,
                menuIds: result.join(',')
            }
            
            this.role.menuIds = data.menuIds

            saveRoleMenu(data).then(resp => {
                this.$message({
						type: 'success',
						message: `修改【${this.role.roleName}】权限成功`
                    })
                this.savemenuing = false
                this.updateData(false)
            })
        },
        updateData(isdel){
            for(const v of this.roledata){
                if(v.roleId === this.role.roleId){
                    const index = this.roledata.indexOf(v)
                    if(isdel){
                       this.roledata.splice(index,1)
                       this.$refs['roletable'].setCurrentRow(this.roledata[0])
                    }else{
                        this.roledata.splice(index,1,this.role)
                        this.$refs['roletable'].setCurrentRow(this.roledata[index])
                    }
                    break
                }
            }

        },
        nodeclick(data, node, nodedata){
           this.checkAll = false
           this.isIndeterminate = true
           this.currentNode = data
           this.menubuttons = this.allbutton[this.currentNode.id]
           let rolemenubutton = this.rolebuttons[this.currentNode.id]
           if(rolemenubutton != undefined){
               this.buttonlist = rolemenubutton.map(item =>{ return item.buttonId})
               if(rolemenubutton.length == this.menubuttons.length){
                  this.isIndeterminate = false
                  this.checkAll = true
               }              
           }
        },
        saveRoleButtons(){
           const req = {
               roleId: this.role.roleId,
               menuId: this.currentNode.id,
               buttonIds: this.buttonlist
           }
           this.savebuttoning = true
           saveRoleButtons(req).then(data =>{
               this.savebuttoning = false
               this.getRoleButtons(this.role.roleId)
                this.$message({
						type: 'success',
						message: `修改【${this.currentNode.label}】权限成功`
                    })
           })
        },
        handleCheckAllChange(val) {
            let allbuttonids = this.menubuttons.map(item =>{ return item.buttonId}) 
            this.buttonlist = val ? allbuttonids : [];
            this.isIndeterminate = false;
        },
        handleCheckedButtonChange(value){
            let checkedCount = value.length;
            this.checkAll = checkedCount === this.menubuttons.length;
            this.isIndeterminate = checkedCount > 0 && checkedCount < this.menubuttons.length;
        },
        selectUser(res){
            this.showRoleUser = false
            if(validatenull(res)){
               return 
            }
            let roleId = this.role.roleId
            let userIds = res.map(function(elem,index){
                return elem.userId;
            }).join(",")
            
            let req = {
                roleId: roleId,
                userIds: userIds
            }
            saverRoleUser(req).then(data =>{
                this.getRoleUsers(this.role.roleId)
            })
        }

        



    },


  }

</script>
<style lang='scss' scoped>
.app-container{
    height: 100vh;
}
.menu-panel{
    padding: 10px;
}

.menu-text{
    text-align: center;
}

.el-checkbox{
    line-height: 25px;
    font-size: 16px;
}

.roletable{
}

.roleuserbutton{
    height: 25px;
}



.roleusertable{
    margin-top:5px;
    clear:both;
}


</style>