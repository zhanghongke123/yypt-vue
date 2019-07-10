<template>
  <div class="app-container" >
      <el-row>
          <el-col :span="14">
              <svg-icon icon-class="role"/>
              <el-button type="primary" plain size="small" @click="fetchData()" v-permission='"bb"'>刷新</el-button>
              <el-button type="primary" size="small" plain
                            @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
              <el-button type="primary" size="small" plain 
                            @click="handleDelete(scope.$index, scope.row)">删除</el-button>
              <el-table ref="roletable" height="600" style="width: 100%;margin-top: 10px;" v-loading="listLoading" :data="roledata"
                        row-key="roleId" border highlight-current-row @current-change="rowchange">
                    <el-table-column prop="roleId" label="ID" header-align="center" align="center"  min-width="100">
                    </el-table-column>

                    <el-table-column prop="roleName" label="角色名称" header-align="center" align="center"  min-width="150">
                    </el-table-column>

                    <el-table-column prop="roleCode" label="排序" header-align="center" align="center"  min-width="80">
                    </el-table-column>

                    <el-table-column prop="createDate" label="创建日期" header-align="center" align="center"  min-width="180">
                    </el-table-column>

                    <el-table-column prop="modifyDate" label="修改日期" header-align="center" align="center"  min-width="180">
                    </el-table-column>


                    <!-- <el-table-column  :check-strictly="true" fixed="right" align="center" label="操作" min-width="200">
                        <template slot-scope="scope">
                            <el-button size="small" type="text"
                            @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                            <el-button size="small" type="text" 
                            @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                        </template>
                    </el-table-column> -->

              </el-table>
          </el-col>
          <el-col :span="5" class="menu-panel">
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

          <el-col :span="5" class="menu-panel">
              <div class="menu-text">
                <span>【{{ currentNode.label }}】的按钮</span>
              </div>
              <el-divider></el-divider>
              <div style="margin-left:10px;" v-if="menubuttons != undefined && menubuttons.length > 0">
                <el-button size="mini" type="primary" plain :loading="savebuttoning" @click="saveRoleButtons">保存{{currentNode.label}}按钮信息</el-button>
              </div>
              <el-checkbox-group v-model="buttonlist" >
                    <el-checkbox style="width:100%" v-for="button in menubuttons" :key="'check'+ button.buttonId" 
                    :label="button.buttonId"  >{{ button.name + "(" +button.permission+")"  }}</el-checkbox>
               </el-checkbox-group>

          </el-col>

      </el-row>
      <el-dialog >

      </el-dialog>
  </div>
</template>

<script>
import { list, getMenuTree, saveRoleMenu, getRoleButtons, saveRoleButtons } from '@/api/system/role'
import { getMenuButtons } from '@/api/system/menu'
import { validatenull } from '@/utils/validate'

const defaultrole = {
      roleId:null,
      roleName:'',
      roleCode:null
}

  export default {
    name:'',
    props:[''],
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
          rolebuttons:{}
      };
    },

    created(){
      //获取所有菜单的树形信息
      this.getMenu()
      //获取角色列表
      this.fetchData()
    },
    methods: {
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
        rowchange(currentRow,oldCurrentRow){
            this.role = currentRow
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
        },
        handleEdit(index,rowdata){
            
        },
        handleDelete(index,rowdata){

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
            console.log(this.role)
            
            this.role.menuIds = data.menuIds

            saveRoleMenu(data).then(resp => {
                this.$message({
						type: 'success',
						message: `修改【${this.role.roleName}】权限成功`
                    })
                this.savemenuing = false
                this.updateData()
            })
        },
        updateData(){
            for(const v of this.roledata){
                if(v.roleId === this.role.roleId){
                    const index = this.roledata.indexOf(v)
                    this.roledata.splice(index,1,this.role)
                    console.log('匹配成功'+index)
                    break
                }
            }

        },
        nodeclick(data, node, nodedata){
           this.currentNode = data
           this.menubuttons = this.allbutton[this.currentNode.id]
           let rolemenubutton = this.rolebuttons[this.currentNode.id]
           if(rolemenubutton != undefined){
               this.buttonlist = rolemenubutton.map(item =>{ return item.buttonId})
           }
           console.log(this.buttonlist) 
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

        }

        



    },


  }

</script>
<style lang='scss' scoped>
.app-container{
    height: 600px;
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

</style>