<template>
  <div class="user-container">
    <div style="height:35px">
    </div>
    <el-table :data="userlist"         
        ref="usertable"
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
      </el-table-column>

      <el-table-column prop="lockDate" label="锁定日期">       
      </el-table-column>

      <el-table-column prop="create_date" label="创建日期">        
      </el-table-column>

      <el-table-column prop="modify_date" label="修改日期">        
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
  </div>
</template>

<script>
import { list } from '@/api/system/user'


  export default {
    props:[''],
    data () {
      return {
        currentPage: 0,
        total: 0,
        pagesizes:[100, 200, 300, 400],
        pageSize:100,
        userlist:[],
        userlistLoading:false,
        sortField: "userId",
        sortOrder: "asc",
        querylist: {}
      };
    },
    created(){
      this.fetchData()
    },

    methods: {
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
              this.userlistLoading = false
          }).catch(err =>{
              console.log(err)
          })
      },
      handleSizeChange(val){

      },
      handleCurrentChange(val){

      }

      
    },


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