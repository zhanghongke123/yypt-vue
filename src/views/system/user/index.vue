<template>
  <div class="user-container">
    <div style="height:35px">
              <yypt-button v-permission='"user:add"' permission='user:add' @click="click('新增')"></yypt-button>
              <yypt-button v-permission='"user:edit"' permission='user:edit' @click="click('修改')"></yypt-button>
              <yypt-button v-permission='"user:delete"' permission='user:delete' @click="click('删除')"></yypt-button>
    </div>
    <el-table :data="userlist"         
        ref="p"
        style="width: 100%;"
        row-key="userId"
        height="80vh"
        border
        default-expand-all
        highlight-current-row
        @current-change="rowchange"
        v-loading="userlistLoading">

      <el-table-column prop="userId" label="ID">        
      </el-table-column>

      <el-table-column prop="userName" label="用户名"> 
      </el-table-column>
      
      <el-table-column prop="realName" label="真实姓名">
      </el-table-column>

      <el-table-column prop="sex" label="性别">
        <template slot-scope="scope">
          {{ scope.row.sex | getValueText('sexdict')}}
        </template>
      </el-table-column>

      <el-table-column prop="avatar" label="头像">
      </el-table-column>

      <el-table-column prop="mobile" label="手机号">
      </el-table-column>

      <el-table-column prop="deptName" label="部门名称">
      </el-table-column>

      <el-table-column prop="roleNames" label="角色集合">
      </el-table-column>

      <el-table-column prop="idcard" label="身份证号">
      </el-table-column>

      <el-table-column prop="openid" label="openid">
      </el-table-column>

      <el-table-column prop="status" label="用户状态">
        <template slot-scope="scope">
          {{ scope.row.status | getValueText('statusdict')}}
        </template>
      </el-table-column>

      <el-table-column prop="lockDate" label="锁定日期">       
      </el-table-column>

      <el-table-column prop="createDate" label="创建日期">        
      </el-table-column>

      <el-table-column prop="modifyDate" label="修改日期">        
      </el-table-column>

      <el-table-column prop="roleIds" label="角色ID集合">        
      </el-table-column>

      <el-table-column prop="deptId" label="部门ID">
      </el-table-column>

    </el-table>
    <el-pagination background :page-sizes="pagesizes" :current-page="currentPage" @size-change="handleSizeChange" :page-size="pageSize"
      @current-change="handleCurrentChange"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>

    <el-dialog :title="title" :visible.sync="dialogUserVisible" >
        <el-form :model="user" ref="userForm"  :rules="rules" label-width="80px" size='small'>

          <el-row>
            <el-col :span="12">
                <el-form-item prop="userName" label="用户名:">
                   <el-input v-model="user.userName" placeholder="请输入用户名"></el-input>
                </el-form-item>
            </el-col>

            <el-col :span="12">
                <el-form-item prop="realName" label="真实姓名:">
                    <el-input v-model="user.realName" placeholder="请输入真实姓名" ></el-input>
                </el-form-item>
            </el-col>
          </el-row>


          <el-row>
            <el-col :span="12">
                <el-form-item prop="mobile" label="手机号:">
                   <el-input v-model="user.mobile" placeholder="请输入手机号"></el-input>
                </el-form-item>
            </el-col>

            <el-col :span="12">
                <el-form-item prop="sex" label="性别:">
                    <el-select v-model="value" clearable placeholder="请选择">
                      <el-option
                        v-for="item in sexoptions"
                        :key="'select'+item.value"
                        :label="item.label"
                        :value="item.value">
                      </el-option>
                    </el-select>
                </el-form-item>
            </el-col>
          </el-row>


            <el-form-item prop="deptId" label= "所属部门">
                    <el-cascader :props="{value:'id',label:'label',expandTrigger:'hover'}" :show-all-levels='false'
                    v-model="user.deptId" :filter-method='filtdept' clearable filterable
                    :options="deptoptions">
                    </el-cascader>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer" style="text-align:center">
          <el-button @click="dialogUserVisible = false">取 消</el-button>
          <el-button type="primary" @click="handUserSave()">保存</el-button>
        </div> 
    </el-dialog>

  </div>
</template>

<script>
import { list, deptTree } from '@/api/system/user'
import { truncate } from 'fs';

const defaultuser = {
    userId: '',
    userName: '',
    realName: '',
    avatar: '',
    mobile:'',
    deptName:'',
    roleNames:'',
    idcard:'',
    openid:'',
    status:1,
    sex:null,
    lockDate:null,
    createDate:null,
    modifyDate:null,
    roleIds:null,
    deptId:null
}

const sexdict = [
  { key: 1, label: "男" },
  { key: 2, label: "女" }
]

const statusdict = [
    { key: 0, label: "停用" },
    { key: 1, label: "启用" },
    { key: 2, label: "冻结" }

]


  export default {
    props:[''],
    data () {
      return {
        sexoptions:sexdict,
        deptoptions:[],
        user: Object.assign({}, defaultuser),
        currentPage: 0,
        total: 0,
        pagesizes:[100, 200, 300, 400],
        pageSize:100,
        userlist:[],
        userlistLoading:false,
        sortField: "userId",
        sortOrder: "asc",
        querylist: {},
        dialogUserVisible: false,
        rules:{
           userName:[
             {required:true,message:'用户名用来登录系统不能为空',trigger:'blur'}
           ]
        },
        title:'',
        userEdit: false

      };
    },
    created(){
      this.getDeptTree()
      this.fetchData()
    },

    methods: {
        click(command){
          //获取当前选中的角色
          let currentUser = this.user
          if(command == "新增"){
             this.userEdit = false
             this.title = '新增人员'
             this.user = Object.assign({}, defaultuser)
             this.dialogUserVisible = true
             this.$nextTick(() => {
                this.$refs['userForm'].clearValidate()
             })  

          }else if(command == "修改"){
             this.userEdit = true
             this.dialogUserVisible = true
             this.$nextTick(() => {
                this.$refs['userForm'].clearValidate()
             })              
          }else if(command == "删除"){
            this.$confirm(`是否删除【${this.user.userName}】`, '警告', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(async() => {
                        // await delRole(this.role)
                        // this.$message({
                        //     type: 'success',
                        //     message: '删除成功'
                        // })
                        // this.updateData(true)
                    }).catch(err => {
                        console.error(err)
                    })   
          }
      },
      rowchange(currentRow,oldRow){
        
     
      },
      fetchData(){
          this.userlistLoading = true
          const req = {
            pageSize: this.pageSize,
            pageNum: this.currentPage,
            sortField: this.sortField,
            sortOrder: this.sortOrder,
            querylist: this.querylist
          }
          list(req).then( data =>{
              this.userlist = data.records
              this.total = data.total
              this.userlistLoading = false
          }).catch(err =>{
              console.log(err)
          })
      },
      async getDeptTree(){
          await deptTree({}).then(data =>{
            this.deptoptions = data
          })
      },
      handleSizeChange(val){

      },
      handleCurrentChange(val){

      },
      handUserSave(){

      },
      filtdept(node, keyword){
          console.log(node)
          if(isNaN(keyword)){
            //如果是非数字匹配中文
            if(node.text.indexOf(keyword) == 0){
              return true
            }
          }else{
            if(node.value == Number(keyword)){
                return true
            }
          }
      }

      
    },
    filters:{
      getValueText(value, valname){
       let dict =  eval(valname)
       console.log("---------------------------------"+value)
       for(let info of dict){
          if(info.key == value){
             return info.label
          }
       }
      }
    }


  }

</script>
<style lang='scss' scoped>
.user {
  &-container{
    margin: 5px;
  }
  &-top{
    margin: 5px;
  }
}

</style>