<template>
  <div class="app-container">
      <el-table
    :data="menutreedata"
    style="width: 100%;margin-bottom: 20px;"
    row-key="menuId"
    border
    highlight-current-row
    default-expand-all
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
        <el-tag effect="dark" :type='scope.row.type == 1?"success":""'>{{ scope.row.type | getValueText('typedict') }}</el-tag>
      </template>
    </el-table-column>

    <el-table-column prop="parentid" label="父级ID" header-align="center" align="center"  sortable min-width="100">
    </el-table-column>

    <el-table-column prop="createDate" label="创建日期" header-align="center" align="center"  sortable width="180">
    </el-table-column>


    <el-table-column prop="modifyDate" label="修改日期" header-align="center" align="center"  sortable width="180">
    </el-table-column>

     <el-table-column fixed="right" align="center" label="操作" min-width="220">
      <template slot-scope="scope">
        <el-button
          size="mini"
          @click="handleAdd(scope.$index, scope.row)">添加</el-button>
        <el-button
          size="mini"
          @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
        <el-button
          size="mini"
          type="danger"
          @click="handleDelete(scope.$index, scope.row)">删除</el-button>
      </template>
    </el-table-column>
  </el-table>




  <el-dialog :title='dialogTitle' :visible.sync="dialogVisible">
      <el-dialog
      width="80%"
      title="选择菜单的图标"
      :visible.sync="iconVisible"
      :modal-append-to-body = "false"
      append-to-body >
          <IconLib @getIcon='getIcon'></IconLib>
     </el-dialog>
     

    <el-form :model="menu" label-width="80px" size='small'>
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
                      <el-button  type="text" @click="iconVisible = true">选择图标</el-button>
                  </el-col>
                </el-row>
            </el-form-item>
         </el-col>
      </el-row>


       <el-row >
         <el-col :span="12">
            <el-form-item prop="type" label="类型:">
                <el-select v-model="menu.type" >
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
      <el-button @click="dialogFormVisible = false">取 消</el-button>
      <el-button type="primary" @click="dialogFormVisible = false">保存</el-button>
    </div>  
  </el-dialog>

    
  </div>
</template>

<script>
import IconLib from '@/components/IconLib'
import { getMenuTree } from '@/api/system/menu'

const defaultmenu = {
      menuId:null,
      path:null,
      component:null,
      parentid:null,
      orderCode:null,
      name:null,
      icon:'user',
      permission:null,
      type:1,
      createDate:null,
      modifyDate:null
}

const typedict = [
  { key: 1, label: "菜单" },
  { key: 2, label: "按钮" }
]


  export default {
    props:[''],
    components:{
      IconLib
    },
    data () {
      return {
        menutreedata:[],
        isedit:false,
        typedict:typedict,
        dialogVisible:false,
        iconVisible:false,
        dialogTitle:'',
        menu:Object.assign({}, defaultmenu),
      };
    },

    mounted() {
      this.fetchData()
    },

    methods: {
      fetchData(){
        getMenuTree().then(data =>{
           this.menutreedata = data
        })
      },
      getIcon(icon){
        console.log("---"+icon)
        this.menu.icon = icon
        this.iconVisible = false
      },
      handleAdd(index, menudata){
        this.dialogVisible = true;
        this.dialogTitle = `添加 【${menudata.name}】 的子级`
      },

    },

    filters:{
      getValueText(value,varname){
        var aa = eval(varname)
        for(var i = 0; i < aa.length; i++){
            let item = aa[i]
            if(item.key == value){
                return item.label
            }
        }
      } 
    }

  }

</script>
<style lang='scss' scoped>
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
