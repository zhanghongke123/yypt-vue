<template>
  <div class="app-container">

    <el-row>
      <!-- 左边 （树形区域）-->
      <el-col :span="4">
         <el-tree ref="menutree" node-key="menuId" :data="menutreedata" :highlight-current="true" :props="menuTreeProp" @node-click='nodeclick' default-expand-all></el-tree>
      </el-col>

      <!-- 右部分（表格部分） -->
      <el-col :span="20">
      <!-- 总单部分 -->
          <el-table
            :data="menutreedata"
            ref="mastertable"
            style="width: 100%;margin-bottom: 20px;"
            row-key="menuId"
            height="45vh"
            border
            highlight-current-row
            default-expand-all
            v-loading="listLoading"
            @current-change='masterChange'
            :tree-props="{children: 'children', hasChildren: 'hasChildren'}">

            <el-table-column prop="menuId" label="ID" header-align="center" align="center"  min-width="100">
            </el-table-column>

            <el-table-column prop="name" label="名称" header-align="center" align="center"   min-width="120">
            </el-table-column>

            <el-table-column prop="path" label="路径" header-align="center" align="center"  sortable min-width="120">
            </el-table-column>

            <el-table-column prop="component" label="组件名称" header-align="center" align="center"  sortable min-width="120">
            </el-table-column>

            <el-table-column   prop="icon" label="图标" class-name="icon-column" header-align="center" align="center"   min-width="80">
              <template slot-scope="scope">
                  <svg-icon :icon-class="scope.row.icon"></svg-icon>
              </template>
            </el-table-column>

            <el-table-column prop="permission" label="权限" header-align="center" align="center"   min-width="100">
            </el-table-column>

            <el-table-column prop="type" label="类型" header-align="center" align="center"  sortable min-width="100">
              <template slot-scope="scope">
                {{ scope.row.component | getValueText('typedict') }}
              </template>
            </el-table-column>

            <el-table-column prop="parentid" label="父级ID" header-align="center" align="center"  sortable min-width="100">
            </el-table-column>

            <el-table-column prop="createDate" label="创建日期" header-align="center" align="center"  sortable width="180">
            </el-table-column>


            <el-table-column prop="modifyDate" label="修改日期" header-align="center" align="center"  sortable width="180">
            </el-table-column>

            <el-table-column fixed="right" align="center" label="操作" min-width="250">
              <template slot-scope="scope">
                <el-button
                  size="mini" type="text"
                  @click="handleAdd(scope.$index, scope.row)">添加子级</el-button>
                <el-button
                  size="mini" type="text"
                  @click="handleAddButton(scope.$index, scope.row)">添加按钮</el-button>
                <el-button
                  size="mini" type="text"
                  @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                <el-button
                  size="mini" type="text"
                  @click="handleDelete(scope.$index, scope.row)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>


            <!-- 细单部分 -->

          <el-table
          :data="buttondata"
          style="width: 100%;margin-bottom: 20px;"
          row-key="buttonId"
          border
          highlight-current-row
          height="30vh"
          v-loading="buttonlistLoading">

            <el-table-column prop="buttonId" label="ID" header-align="center" align="center"  min-width="100">
            </el-table-column>


            <el-table-column prop="name" label="名称" header-align="center" align="center"   min-width="120">
            </el-table-column>

            <el-table-column prop="requestPath" label="请求路径" header-align="center" align="center"  sortable min-width="120">
            </el-table-column>


            <el-table-column   prop="icon" label="图标" class-name="icon-column" header-align="center" align="center"   min-width="80">
              <template slot-scope="scope">
                  <svg-icon :icon-class="scope.row.icon"></svg-icon>
              </template>
            </el-table-column>

            <el-table-column prop="permission" label="权限" header-align="center" align="center"   min-width="100">
            </el-table-column>

            <el-table-column prop="menuId" label="功能ID" header-align="center" align="center"  sortable min-width="100">
            </el-table-column>

            <el-table-column prop="createDate" label="创建日期" header-align="center" align="center"  sortable width="180">
            </el-table-column>


            <el-table-column prop="modifyDate" label="修改日期" header-align="center" align="center"  sortable width="180">
            </el-table-column>

            <el-table-column fixed="right" align="center" label="操作" min-width="220">
              <template slot-scope="scope">
                <el-button
                  size="mini" type="text"
                  @click="handleButtonEdit(scope.$index, scope.row)">编辑</el-button>
                <el-button
                  size="mini" type="text"
                  @click="handleButtonDelete(scope.$index, scope.row)">删除</el-button>
              </template>
            </el-table-column>
        </el-table>


      </el-col>
    </el-row>
    

   <el-dialog :title='dialogTitle' :visible.sync="dialogVisible">
      <el-dialog
      width="80%"
      title="选择菜单的图标"
      :visible.sync="menuiconVisible"
      :modal-append-to-body = "false"
      append-to-body >
          <IconLib @getIcon='getMenuIcon'></IconLib>
     </el-dialog>
     

    <el-form :model="menu" ref="menuForm" :rules="rules" label-width="80px" size='small'>
      <el-row >
         <el-col :span="12">
            <el-form-item prop="name" label="名称:">
              <el-input v-model="menu.name"></el-input>
            </el-form-item>
         </el-col>
         <el-col :span="12">
            <el-form-item prop="icon" label="图标:">
                <el-row>
                  <el-col :span="12" style="text-align:center">
                      <svg-icon :icon-class="menu.icon"></svg-icon>
                  </el-col>
                  <el-col :span="12">
                      <el-button  type="text" @click="menuiconVisible = true">选择图标</el-button>
                  </el-col>
                </el-row>
            </el-form-item>
         </el-col>
      </el-row>


       <el-row >
         <el-col :span="12">
            <el-form-item prop="type" label="类型:">
                <el-select v-model="menu.type" :disabled="ismenuedit == true" >
                    <el-option
                      v-for="item in typedict"
                      :key="item.key"
                      :label="item.label"
                      :value="item.key">
                    </el-option>
                </el-select>
            </el-form-item>
         </el-col>
         <el-col :span="12">
            <el-form-item prop="orderCode" label="排序号:">
                   <el-input v-model="menu.orderCode"></el-input>
            </el-form-item>
         </el-col>
      </el-row>
    
      
      <el-form-item prop="path" label="路径:">
        <el-input v-model="menu.path"></el-input>
      </el-form-item>


      <el-form-item prop="component" label="组件:">
        <el-input v-model="menu.component"></el-input>
      </el-form-item>


      <el-form-item prop="permission" label="权限:">
        <el-input v-model="menu.permission"></el-input>
      </el-form-item> 
    </el-form>

    <div slot="footer" class="dialog-footer" style="text-align:center">
      <el-button @click="dialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="handSave()">保存</el-button>
    </div>  
   </el-dialog>



<!-- 子单部分 -->
  <el-dialog :title='dialogTitle' :visible.sync="buttondialogVisible">
      <el-dialog
      width="80%"
      title="选择菜单的图标"
      :visible.sync="buttoniconVisible"
      :modal-append-to-body = "false"
      append-to-body >
          <IconLib @getIcon='getMenuButtonIcon'></IconLib>
     </el-dialog>
     

    <el-form :model="menubutton" ref="menubuttonForm" :rules="buttonrules" label-width="80px" size='small'>
      <el-row >
         <el-col :span="12">
            <el-form-item prop="name" label="名称:">
              <el-input v-model="menubutton.name"></el-input>
            </el-form-item>
         </el-col>
         <el-col :span="12">
            <el-form-item prop="icon" label="图标:">
                <el-row>
                  <el-col :span="12" style="text-align:center">
                      <svg-icon :icon-class="menubutton.icon"></svg-icon>
                  </el-col>
                  <el-col :span="12">
                      <el-button  type="text" @click="buttoniconVisible = true">选择图标</el-button>
                  </el-col>
                </el-row>
            </el-form-item>
         </el-col>
      </el-row>

      
      <el-row>
        <el-col :span="12">
          <el-form-item prop="requestPath" label="请求路径:">
            <el-input v-model="menubutton.requestPath"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item prop="orderCode" label="排序号:">
            <el-input v-model="menubutton.orderCode"></el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <el-form-item prop="permission" label="权限:">
        <el-input v-model="menubutton.permission"></el-input>
      </el-form-item> 
    </el-form>

    <div slot="footer" class="dialog-footer" style="text-align:center">
      <el-button @click="buttondialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="handButtonSave()">保存</el-button>
    </div>  
  </el-dialog>

    
  </div>
</template>

<script>
import IconLib from '@/components/IconLib'
import { getMenuTree, save, del, getMenuButtons, delButton, saveButton } from '@/api/system/menu'
import { deepClone } from '@/utils'

const defaultmenu = {
      menuId:null,
      path:null,
      component:null,
      parentid:null,
      orderCode:null,
      name:null,
      icon:'',
      permission:null,
      type:1,
      createDate:null,
      modifyDate:null
}

const defaultmenuButton = {
      buttonId:null,
      name:null,
      requestPath:null,
      icon:'',
      orderCode:null,
      menuId:null,
      permission:'',
      createDate:null,
      modifyDate:null
}

const typedict = [
  { key: 1, label: "目录" },
  { key: 2, label: "功能" }
]


  export default {
    props:[''],
    components:{
      IconLib
    },
    data () {
      return {
        menutreedata:[],
        buttondata:[],
        buttonlistLoading: true,
        listLoading: true,
        ismenuedit: false,
        isbuttonedit: false,
        typedict: typedict,
        dialogVisible: false,
        buttondialogVisible: false,
        menuiconVisible: false,
        buttoniconVisible: false,
        dialogTitle:'',
        menu:Object.assign({}, defaultmenu),
        menubutton: Object.assign({},defaultmenuButton),
        rules: {
            name: [{ required: true, message: '名称不能为空', trigger: 'change' }],
        },
        buttonrules: {
            name: [{ required: true, message: '名称不能为空', trigger: 'change' }],
        },
        menuTreeProp:{
          children:'children',
          label: 'name'
        }
      };
    },

    created() {
      this.fetchData()
    },

    methods: {
      fetchData(){
        this.listLoading = true
        getMenuTree().then(data =>{
          this.menutreedata = data
          this.listLoading = false
          this.$refs.mastertable.setCurrentRow(this.menutreedata[0])
        })
      },
      fetchMenuButton(menuId){
        this.buttonlistLoading = true
        const req = {
          "menuId": menuId
        }
        getMenuButtons(req).then(data =>{
          this.buttondata = data
          this.buttonlistLoading = false
        }) 
      },
      masterChange(currentRow, oldCurrentRow){
        this.fetchMenuButton(currentRow.menuId)
        if(currentRow != null && currentRow != undefined){
          this.$refs['menutree'].setCurrentKey(currentRow.menuId)
        }
      },
      getMenuIcon(icon){
        this.menu.icon = icon
        this.menuiconVisible = false
      },
      getMenuButtonIcon(icon){
        this.menubutton.icon = icon
        this.buttoniconVisible = false
      },
      handleAdd(index, menudata){
        this.ismenuedit = false
        this.menu = Object.assign({},defaultmenu)
        this.menu.parentid = menudata.menuId
        this.dialogVisible = true;
        this.dialogTitle = `添加 【${menudata.name}】 的子级`
        this.dialogVisible
        this.$nextTick(() => {
        this.$refs['menuForm'].clearValidate()
        })  
      },
      handleEdit(index, menudata){
        this.ismenuedit = true
        this.menu = deepClone(menudata)
        if( this.menu.components == 'Layout' ){
            this.menu.type = 1
        }else{
            this.menu.type = 2
        }
        this.dialogTitle = `修改 【${menudata.name} - ${menudata.menuId}】`
        this.dialogVisible = true
        this.$nextTick(() => {
        this.$refs['menuForm'].clearValidate()
        })
      },
      handleDelete(index, menudata){
        this.$confirm(`是否删除【${menudata.name}】以及它的所有子级`, '警告', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(async() => {
					await del(menudata)
					this.$message({
						type: 'success',
						message: '删除成功'
					})
          //添加菜单的话需要刷新总单
          this.fetchData()
				}).catch(err => {
					console.error(err)
				})
      },
      handSave(){
        this.$refs['menuForm'].validate((valid) =>{
          if(valid){
             save(this.menu).then(resp => {
               this.$message({
                 type:'success',
                 message: '保存成功'
               })
               this.dialogVisible = false
               this.fetchData()
             }).catch(error =>{
               console.error(error)
             })
          }
        })

      },
      handleAddButton(index, menudata){
        this.isbuttonedit = false
        this.menubutton = Object.assign({},defaultmenuButton)
        this.menubutton.menuId = menudata.menuId
        this.buttondialogVisible = true;
        this.dialogTitle = `添加 【${menudata.name}】 的按钮`
        this.$nextTick(() => {
        this.$refs['menubuttonForm'].clearValidate()
        })  
      },
      handleButtonEdit(index, buttondata){
        this.isbuttonedit = true
        this.menubutton = deepClone(buttondata)
        this.dialogTitle = `修改 【${buttondata.name}】`
        this.buttondialogVisible = true
        this.$nextTick(() => {
        this.$refs['menubuttonForm'].clearValidate()
        })
      },
      handleButtonDelete(index, buttondata){
        this.$confirm(`是否删除【${buttondata.name}】`, '警告', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(async() => {
					await delButton(buttondata)
					this.$message({
						type: 'success',
						message: '删除成功'
					})
          //添加菜单的话需要刷新总单
          this.fetchMenuButton(buttondata.menuId)
				}).catch(err => {
					console.error(err)
				})
      },
      handButtonSave(){
        this.$refs['menubuttonForm'].validate((valid) =>{
          if(valid){
             saveButton(this.menubutton).then(resp => {
               this.$message({
                 type:'success',
                 message: '保存按钮成功'
               })
               this.buttondialogVisible = false
               this.fetchMenuButton(this.menubutton.menuId)
             }).catch(error =>{
               console.error(error)
             })
          }
        })
      },
      nodeclick(data, node, nodedata){
          this.$refs['mastertable'].setCurrentRow(data)
      }
    },

    filters:{
      getValueText(value,varname){
        if(value == 'Layout'){
           return "目录"
        }else{
          return  "功能"
        }
      } 
    }

  }

</script>
<style lang='scss' scoped>
.app-container{
  height: 90vh;
}
.svg-icon{
 width: 20px;
 height: 20px;
}

.el-form-item__content .svg-icon{
   margin-top: 0px;
   width: 24px;
   height: 24px;
}
</style>
