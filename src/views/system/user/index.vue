<template>
  <div class="user-container">

    <!-- 查询部分  -->
  <YyptQuery :querycols="querycolumn" @query="query"></YyptQuery>


    <div style="height:35px">
              <yypt-button v-permission='"user:add"' permission='user:add' @click="click('新增')"></yypt-button>
              <yypt-button v-permission='"user:edit"' permission='user:edit' @click="click('修改')"></yypt-button>
              <yypt-button v-permission='"user:delete"' permission='user:delete' @click="click('删除')"></yypt-button>
              <yypt-button v-permission='"user:respassword"' permission='user:respassword' @click="click('重置密码')"></yypt-button>

    </div>
    <el-table :data="userlist"         
        ref="usertable"
        style="width: 100%;"
        row-key="userId"
        height="70vh"
        border
        stripe
        default-expand-all
        highlight-current-row
        @current-change="rowchange"
        v-loading="userlistLoading">
    
      <el-table-column prop="userId" label="ID" width="80" align="center">        
      </el-table-column>

      <el-table-column prop="userName" label="用户名" width="100" align="center"> 
      </el-table-column>
      
      <el-table-column prop="realName" label="真实姓名" width="100" align="center">
      </el-table-column>

      <el-table-column prop="sex" label="性别" width="70" align="center">
        <template slot-scope="scope">
          {{ scope.row.sex | getValueText('sexdict')}}
        </template>
      </el-table-column>

      <el-table-column prop="status" label="用户状态" align="center" width="80">
        <template slot-scope="scope">
          <el-tag effect="light" size="small" :type="gettagtype(scope.row.status)">
            {{ scope.row.status | getValueText('statusdict')}}
          </el-tag>
        </template>
      </el-table-column>

      <el-table-column prop="avatar" label="头像" align="center"    width="80" >
      </el-table-column>

      <el-table-column prop="mobile" label="手机号" align="center" width="120">
      </el-table-column>

      <el-table-column prop="deptName" label="部门名称" align="center" width="100" >
      </el-table-column>

      <el-table-column prop="roleNames" label="角色集合" align="center" width="200" >
      </el-table-column>

      <el-table-column prop="idcard" label="身份证号" align="center" width="200" >
      </el-table-column>

      <el-table-column show-overflow-tooltip prop="openid" label="openid" align="center" width="200">
      </el-table-column>


      <el-table-column prop="lockDate" label="锁定日期" align="center" width="160">       
      </el-table-column>

      <el-table-column prop="createDate" label="创建日期" align="center" width="160">        
      </el-table-column>

      <el-table-column prop="modifyDate" label="修改日期" align="center" width="160">        
      </el-table-column>

      <el-table-column show-overflow-tooltip prop="memo" label="备注" align="center" width="160">        
      </el-table-column>

      <el-table-column prop="roleIds" label="角色ID集合" align="center" width="160">        
      </el-table-column>

      <el-table-column prop="deptId" label="部门ID" align="center" width="160">
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
            <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
                <el-form-item prop="userName" label="用户名:">
                   <el-input v-model="user.userName" placeholder="请输入用户名"></el-input>
                </el-form-item>
            </el-col>

            <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
                <el-form-item prop="realName" label="真实姓名:">
                    <el-input v-model="user.realName" placeholder="请输入真实姓名" ></el-input>
                </el-form-item>
            </el-col>
          </el-row>


          <el-row>
            <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
                <el-form-item prop="mobile" label="手机号:">
                   <el-input v-model="user.mobile" placeholder="请输入手机号"></el-input>
                </el-form-item>
            </el-col>

            <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
                <el-form-item prop="sex" label="性别:">
                    <el-select v-model="user.sex" clearable placeholder="请选择">
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
          

          <el-row>
           <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
              <el-form-item prop="deptId" label= "所属部门">
                      <el-cascader :props="{value:'id',label:'label',expandTrigger:'hover',checkStrictly:true}" :show-all-levels='false'  :multiple="false"
                      v-model="user.deptId" :filter-method='filtdept' clearable filterable
                      :options="deptoptions">
                      </el-cascader>
              </el-form-item>
            </el-col>

            <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
                <el-form-item prop="idcard" label="身份证号:">
                   <el-input v-model="user.idcard" placeholder="请输入身份证号"></el-input>
                </el-form-item>
            </el-col>
         </el-row>

        </el-form>
        <div slot="footer" class="dialog-footer" style="text-align:center">
          <el-button @click="dialogUserVisible = false">取 消</el-button>
          <el-button :loading="saveing"  type="primary" @click="handUserSave()">保存</el-button>
        </div> 
    </el-dialog>



    <el-dialog :title="'重置'+user.userName+'的密码'" :visible.sync="showpassword" >
      <el-form>
          <el-row>
            <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
                <el-form-item label="新密码:">
                   <el-input v-model="newpass" placeholder="请输入密码"></el-input>
                </el-form-item>
            </el-col>
          </el-row>
      </el-form>  
      <div slot="footer" class="dialog-footer" style="text-align:center">
          <el-button @click="showpassword = false">取 消</el-button>
          <el-button :loading="saveing"  type="primary" @click="handpassword()">确定</el-button>
      </div> 
    </el-dialog>

  </div>
</template>

<script>
import { list, deptTree, save, del } from '@/api/system/user'
import { deepClone } from '@/utils'
import YyptQuery from '@/components/YyptQuery'


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
  { value: 1, label: "男" },
  { value: 2, label: "女" }
]

const statusdict = [
    { value: 0, label: "停用" },
    { value: 1, label: "启用" },
    { value: 2, label: "冻结" }

]

const querycolumn = [
      {
        prop:"userId",
        label:"人员ID",
        type:"input"
    },
    {
        prop:"userName",
        label:"用户名",
        type:"input"
    },
    {
        prop:"status",
        label:"状态",
        type:"select",
        options:statusdict
    }
]


  export default {
    components:{
      YyptQuery
    },
    data () {
      const checkPhone = (rule, value, callback) => {
        if (!value) {
          return callback();
        } else {
          const reg = /^1[3|4|5|7|8][0-9]\d{8}$/
          if (reg.test(value)) {
            callback();
          } else {
            return callback(new Error('请输入正确的手机号'));
          }
        }
      }
      return {
        querycolumn:querycolumn,
        sexoptions:sexdict,
        deptoptions:[],
        user: Object.assign({}, defaultuser),
        currentPage: 0,
        total: 0,
        pagesizes:[20, 40, 100],
        pageSize:20,
        userlist:[],
        userlistLoading:false,
        sortField: "userId",
        sortOrder: "desc",
        queryconditions: {
          // userName:'',
          // userId:'',
          // status:''
        },
        dialogUserVisible: false,
        rules:{
           userName:[{required:true,message:'用户名用来登录系统不能为空',trigger:'blur'}],
           deptId:[{required:true,message:'所属部门必须维护',trigger:'blur'}],
           mobile:[{validator: checkPhone, trigger: 'blur'}]
        },
        title:'',
        userEdit: false,
        saveing:false,
        showpassword:false,
        newpass:''
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
             this.user.deptId = [ this.user.deptId ]
             this.$nextTick(() => {
                this.$refs['userForm'].clearValidate()
             })              
          }else if(command == "删除"){
            this.$confirm(`是否删除【${this.user.userName}】`, '警告', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(async() => {
                        await del(this.user)
                        this.$message({
                            type: 'success',
                            message: '删除成功'
                        })
                        this.fetchData()
                    }).catch(err => {
                        console.error(err)
                    })   
          }else if(command == '重置密码'){
              this.newpass = ''
              this.showpassword = true
          }
      },
      rowchange(currentRow,oldRow){
        if(currentRow == null){
          this.user =Object.assign({},defaultuser)
        }else{
          this.user = deepClone(currentRow)
        }
      },
      query(val){
        this.currentPage = 0
        this.queryconditions = val
        this.fetchData()
      },
      fetchData(){
          this.userlistLoading = true
          const req = {
            pageSize: this.pageSize,
            pageNum: this.currentPage,
            sortField: this.sortField,
            sortOrder: this.sortOrder,
            querylist: this.queryconditions
          }
          list(req).then( data =>{
              this.userlist = data.records
              this.total = data.total
              this.userlistLoading = false
            if(this.userlist.length > 0){
                this.$refs['usertable'].setCurrentRow(this.userlist[0])
            }
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
        this.pageSize = val
        this.fetchData()
      },
      handleCurrentChange(val){
        this.currentPage = val
        this.fetchData()
      },
      resetQueryForm(){
        // this.$refs["queryform"].resetFields();
        this.queryconditions = {}
      },
      handUserSave(){
          this.$refs['userForm'].validate((vail) => {
              if(vail){
                this.saveing = true
                this.user.deptId = this.user.deptId[0]
                save(this.user).then(data =>{
                      this.$message({
                          type:'success',
                          message: '保存成功'
                      })
                      this.saveing = false
                      this.dialogUserVisible = false
                      this.fetchData();
                  }).catch( error =>{
                      console.error(error)
                      this.saveing = false
                  })
              }
          })
      },
      handpassword(){
         this.saveing = true
         let user = deepClone(this.user)
         user.deptId = this.user.deptId[this.user.deptId.length - 1]
         user.userPassword = this.newpass
         this.$api.post('sysuser/respassword',user).then(resp =>{
              this.saveing = false
              this.$message({
                type:'success',
                message:`重置密码(${this.newpass})成功`
              })
              this.showpassword = false
         }).catch(e =>{
           console.error(e)
           this.saveing = false
         })

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
      },
      gettagtype(value){
        if(value === 0){
          // 停用
          return "danger"
        }else if(value === 1){
          // 启用
          return "success"
        }else if(value === 2){
          //锁定
          return "warning"
        }else{
          return ""
        }    
      }  
    },
    filters:{
      getValueText(value, valname){
       let dict =  eval(valname)
       for(let info of dict){
          if(info.value == value){
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
.el-form-item{
  margin-bottom: 5px;
}

</style>