<template>
  <div class="container">
      <YyptQuery  
       ref="yyptquery"
       :querycols="querycols" 
       @query="query">
       </YyptQuery>

      <el-table :data="datalist"         
        style="width: 100%;"
        row-key="loginId"
        height="70vh"
        border
        stripe
        highlight-current-row
        v-loading="listLoading">
    
      <el-table-column prop="loginId" label="ID" width="80" align="center">        
      </el-table-column>

      <el-table-column prop="userName" label="用户名" width="100" align="center"> 
      </el-table-column>
      
      <el-table-column prop="loginTime" label="登录日期" width="180" align="center">
      </el-table-column>

      <el-table-column prop="location" label="登录地址" width="200" align="center">
      </el-table-column>


      <el-table-column prop="ip" label="登录IP" width="200" align="center">
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
import YyptQuery from '@/components/YyptQuery'

  export default {
    name:'',
    props:[''],
    data () {
      return {
          querycols:[
            {
                prop:"userName",
                label:"用户名",
                type:"input"
            },
            {
                prop:"ip",
                label:"ip",
                type:"input"
            }
          ],
          datalist:[],
          currentPage: 0,
          total: 0,
          pagesizes:[20, 40, 100],
          pageSize:20,
          queryconditions:{},
          sortField:''
      };
    },
    created(){
      this.fetchData()
    },
    components: {
        YyptQuery
    },

    methods: {
      handleSizeChange(val){
        this.pageSize = val
        this.fetchData()
      },
      handleCurrentChange(val){
        this.currentPage = val
        this.fetchData()
      },
      query(res){
          this.queryconditions = res
          this.currentPage = 0
          this.fetchData()
      },
      
      fetchData(){
        this.listLoading = true
        const req = {
          pageSize: this.pageSize,
          pageNum: this.currentPage,
          sortField: this.sortField,
          sortOrder: this.sortOrder,
          querylist: this.queryconditions
        }
        this.$api.post('sysloginlog/list',req).then(resp =>{
            this.datalist = resp.records
            this.total = resp.total
            this.listLoading = false
            this.$refs['yyptquery'].disable(false)
            this.$refs['yyptquery'].isquerying = false
        }).catch(e =>{
            this.$refs['yyptquery'].disable(false)
            this.$refs['yyptquery'].isquerying = false
        })

      }
    },

    watch: {}

  }

</script>
<style lang='scss' scoped>
.container{
  padding: 10px;
}

</style>