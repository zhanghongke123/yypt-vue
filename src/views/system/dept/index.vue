<template>
  <div class="app-container">

  <el-row>
    <!-- 树形结构部分 -->
    <el-col :span="4">
      <el-tree ref="depttree" node-key="deptId" :data="depttreedata" :highlight-current="true" :props="deptTreeProp" @node-click='nodeclick' default-expand-all></el-tree>
    </el-col>

    <!-- 表格部分 -->
    <el-col :span="20">
       <div :style="{height:'35px'}">
          <yypt-button v-permission='"dept:add"' permission='dept:add' @click="click('新增')"></yypt-button>
          <yypt-button v-permission='"dept:edit"' permission='dept:edit' @click="click('修改')"></yypt-button>
          <yypt-button v-permission='"dept:delete"' permission='dept:delete' @click="click('删除')"></yypt-button>
       </div>
        <el-table
        :data="depttreedata"
        ref="depttable"
        style="width: 100%;"
        row-key="deptId"
        height="80vh"
        border
        default-expand-all
        highlight-current-row
        @current-change="rowchange"
        v-loading="deptlistLoading"
        :tree-props="{children: 'children', hasChildren: 'hasChildren'}">

        <el-table-column prop="deptId" label="ID" header-align="center" align="center" width="100px">
        </el-table-column>

        <el-table-column prop="deptName"  header-align="center" align="center" label="部门名称">
        </el-table-column>

        <el-table-column prop="memo" header-align="center" align="center" label="备注">
        </el-table-column>

        <el-table-column prop="orderCode" header-align="center" align="center" label="排序号">
        </el-table-column>


        <el-table-column prop="parentid" header-align="center" align="center" label="上级部门ID">
        </el-table-column>

        <el-table-column prop="createDate" header-align="center" align="center" label="创建日期">
        </el-table-column>

        <el-table-column prop="modifyDate" header-align="center" align="center" label="修改日期">
        </el-table-column>

      </el-table>

    </el-col>
  </el-row>
     
 



<!-- 新增和修改的dialog -->
   <el-dialog :title='dialogTitle' :visible.sync="deptdialogVisible">

    <el-form :model="dept" ref="deptForm" :rules="rules" label-width="120px" size='small'>
      <el-row >
         <el-col :span="12">
            <el-form-item prop="deptName" label="部门名称:">
              <el-input v-model="dept.deptName"></el-input>
            </el-form-item>
         </el-col>
         <el-col :span="12">
            <el-form-item prop="code" label="部门编码">
               <el-input v-model="dept.code"></el-input>
            </el-form-item>
         </el-col>
      </el-row>


       <el-row >
         <el-col :span="8">
            <el-form-item prop="parentname" label="上级部门名称:">
              <el-input v-model="dept.parentname" disabled></el-input>
            </el-form-item>
         </el-col>
         <el-col :span="8">
            <el-form-item prop="parentid" label="上级部门ID:">
                   <el-input v-model="dept.parentid" disabled></el-input>
            </el-form-item>
         </el-col>
         <el-col :span="8">
            <el-form-item prop="orderCode" label="排序号:">
                   <el-input v-model.number="dept.orderCode"></el-input>
            </el-form-item>
         </el-col>
      </el-row>
    
      
      <el-form-item prop="memo" label="备注:">
        <el-input v-model="dept.memo"></el-input>
      </el-form-item>
    </el-form>

    <div slot="footer" class="dialog-footer" style="text-align:center">
      <el-button @click="deptdialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="handSave()">保存</el-button>
    </div>  
  </el-dialog>

    
  </div>
</template>

<script>
import { getDeptTree, save, del } from '@/api/system/dept'
import { deepClone } from '@/utils'


const defaultDept = {
    deptId:null,
    deptName:null,
    memo:null,
    orderCode:null,
    code:null,
    parentid:null,
    parentname:null
}

export default {
    data () {
      return {
          depttreedata:[],
          deptlistLoading:false,
          deptdialogVisible:false,
          dept: Object.assign({},defaultDept),
          dialogTitle:'',
          isDeptEidt: false,
          rules:{
            deptName:[{required:true,message:'部门名称不能为空',trigger:'blur'}],
            orderCode:[{required:true,message:'部门名称不能为空',trigger:'blur'},
                       {type:'number', message:'排序号只能是数字'} 
                       ]
          },
          deptTreeProp:{
            children: 'children',
            label: 'deptName'
          }
      };
    },
    methods: {
        click(command){
          let currentDept = this.dept
          this.dialogTitle = command
          if(command == '新增'){
              this.isDeptEidt = false
              this.dept = Object.assign({}, defaultDept)
              this.dept.parentid = currentDept.deptId
              this.dept.parentname = currentDept.deptName
              this.deptdialogVisible = true
                this.$nextTick(() => {
                    this.$refs['deptForm'].clearValidate()
                })  
          }else if(command == '修改'){
              this.isDeptEidt = false
              this.deptdialogVisible = true
              this.$nextTick(() => {
                    this.$refs['deptForm'].clearValidate()
              })  

          }else if(command == '删除'){
            this.$confirm(`是否删除【${this.dept.deptName}】以及它的子级`, '警告', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(async() => {
                        await del(this.dept)
                        this.$message({
                            type: 'success',
                            message: '删除成功'
                        })
                        this.fetchData()
                    }).catch(err => {
                        console.error(err)
                    })               
          }
        },
        fetchData(){
            this.deptlistLoading = true
            getDeptTree({}).then( data =>{
                this.depttreedata = data
                this.deptlistLoading = false
                if(this.depttreedata.length > 0){
                    this.$refs.depttable.setCurrentRow(this.depttreedata[0])
                }
            }).catch(err =>{
                console.log(err)
            })
        },
        rowchange(currentRow, oldRow){
            this.dept = deepClone(currentRow)
            if(this.dept != null && this.dept != undefined){
              this.$refs['depttree'].setCurrentKey(this.dept.deptId)
            }
        },
        handSave(){
            this.$refs['deptForm'].validate((vail) => {
                if(vail){
                  save(this.dept).then(data =>{
                        this.$message({
                            type:'success',
                            message: '保存成功'
                        })
                        this.deptdialogVisible = false
                        this.fetchData()                            
                    }).catch( error =>{
                        console.error(error)
                    })
                }
            })
        },
        nodeclick(data, node, nodedata){
            this.$refs.depttable.setCurrentRow(data)
        }
    },

    created(){
       this.fetchData()
    }


  }

</script>
<style lang='' scoped>

</style>